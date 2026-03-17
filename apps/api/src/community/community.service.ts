import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import {
  CommunityReportStatus,
  CommunityReportTarget,
  CommunityStatus,
  UserRole,
} from '@prisma/client';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class CommunityService {
  constructor(private readonly databaseService: DatabaseService) {}

  async listPosts(
    take = 20,
    cursor?: string,
    options?: {
      userId?: string;
      tag?: string;
      statuses?: CommunityStatus[];
    },
  ) {
    const where: any = {};
    if (options?.userId) {
      where.userId = options.userId;
    }
    if (options?.tag) {
      where.tags = { has: options.tag };
    }
    if (options?.statuses?.length) {
      where.status = { in: options.statuses };
    }

    const posts = await this.databaseService.communityPost.findMany({
      where,
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
        _count: { select: { comments: true } },
      },
    });

    const nextCursor = posts.length === take ? posts[posts.length - 1].id : null;
    return { items: posts, nextCursor };
  }

  async getPost(postId: string, requester: { id: string; role?: UserRole }) {
    const post = await this.databaseService.communityPost.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
        comments: {
          orderBy: { createdAt: 'asc' },
          where:
            requester?.role === UserRole.ADMIN
              ? undefined
              : {
                  OR: [
                    { status: CommunityStatus.APPROVED },
                    { userId: requester?.id },
                  ],
                },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
                entrepreneurProfile: { select: { firstName: true, lastName: true } },
                investorProfile: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (
      requester?.role !== UserRole.ADMIN &&
      post.status !== CommunityStatus.APPROVED &&
      post.userId !== requester?.id
    ) {
      throw new NotFoundException('Post not found.');
    }
    return post;
  }

  async createPost(userId: string, data: { title: string; body: string; tags?: string[] }) {
    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isVerified: true },
    });
    const status =
      user?.role === UserRole.ADMIN || user?.isVerified
        ? CommunityStatus.APPROVED
        : CommunityStatus.PENDING;

    return this.databaseService.communityPost.create({
      data: {
        userId,
        title: data.title,
        body: data.body,
        tags: data.tags ?? [],
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
        _count: { select: { comments: true } },
      },
    });
  }

  async addComment(userId: string, postId: string, body: string) {
    const post = await this.databaseService.communityPost.findUnique({
      where: { id: postId },
      select: { id: true, status: true, userId: true },
    });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }
    if (post.status !== CommunityStatus.APPROVED) {
      throw new ForbiddenException('Comments are disabled until the post is approved.');
    }

    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isVerified: true },
    });
    const status =
      user?.role === UserRole.ADMIN || user?.isVerified
        ? CommunityStatus.APPROVED
        : CommunityStatus.PENDING;

    return this.databaseService.communityComment.create({
      data: {
        userId,
        postId,
        body,
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async deletePost(postId: string) {
    await this.databaseService.communityComment.deleteMany({
      where: { postId },
    });
    return this.databaseService.communityPost.delete({
      where: { id: postId },
    });
  }

  async deleteComment(commentId: string) {
    return this.databaseService.communityComment.delete({
      where: { id: commentId },
    });
  }

  async listReports() {
    const reports = await this.databaseService.communityReport.findMany({
      where: { status: CommunityReportStatus.OPEN },
      orderBy: { createdAt: 'asc' },
      include: {
        reporter: {
          select: {
            id: true,
            email: true,
            role: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    const enriched = await Promise.all(
      reports.map(async (report) => {
        if (report.targetType === CommunityReportTarget.POST) {
          const post = await this.databaseService.communityPost.findUnique({
            where: { id: report.targetId },
            select: { id: true, title: true, body: true, userId: true, status: true },
          });
          return { ...report, target: post ? { ...post, type: 'POST' } : null };
        }
        const comment = await this.databaseService.communityComment.findUnique({
          where: { id: report.targetId },
          select: { id: true, body: true, userId: true, status: true, postId: true },
        });
        return { ...report, target: comment ? { ...comment, type: 'COMMENT' } : null };
      }),
    );

    return enriched;
  }

  async resolveReport(reportId: string) {
    return this.databaseService.communityReport.update({
      where: { id: reportId },
      data: { status: CommunityReportStatus.RESOLVED },
    });
  }

  async createReport(
    reporterId: string,
    targetType: CommunityReportTarget,
    targetId: string,
    reason: string,
  ) {
    if (targetType === CommunityReportTarget.POST) {
      const post = await this.databaseService.communityPost.findUnique({
        where: { id: targetId },
        select: { id: true, userId: true },
      });
      if (!post) {
        throw new NotFoundException('Post not found.');
      }
      if (post.userId === reporterId) {
        throw new ForbiddenException('You cannot report your own post.');
      }
    } else {
      const comment = await this.databaseService.communityComment.findUnique({
        where: { id: targetId },
        select: { id: true, userId: true },
      });
      if (!comment) {
        throw new NotFoundException('Comment not found.');
      }
      if (comment.userId === reporterId) {
        throw new ForbiddenException('You cannot report your own comment.');
      }
    }

    return this.databaseService.communityReport.create({
      data: {
        reporterId,
        targetType,
        targetId,
        reason,
      },
    });
  }

  async listPendingPosts() {
    return this.databaseService.communityPost.findMany({
      where: { status: CommunityStatus.PENDING },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  async listPendingComments() {
    return this.databaseService.communityComment.findMany({
      where: { status: CommunityStatus.PENDING },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
        post: {
          select: { id: true, title: true },
        },
      },
    });
  }

  async updatePostStatus(postId: string, status: CommunityStatus) {
    return this.databaseService.communityPost.update({
      where: { id: postId },
      data: { status },
    });
  }

  async updateCommentStatus(commentId: string, status: CommunityStatus) {
    return this.databaseService.communityComment.update({
      where: { id: commentId },
      data: { status },
    });
  }

  async setPostPinned(postId: string, isPinned: boolean) {
    return this.databaseService.communityPost.update({
      where: { id: postId },
      data: { isPinned },
    });
  }
}
