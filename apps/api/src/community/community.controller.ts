import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { IsArray, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CommunityReportTarget, CommunityStatus, UserRole } from '@prisma/client';
import { CommunityService } from './community.service';

class CreatePostDto {
  @IsString()
  @MaxLength(120)
  title: string;

  @IsString()
  @MaxLength(5000)
  body: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}

class CreateCommentDto {
  @IsString()
  @MaxLength(2000)
  body: string;
}

class UpdateStatusDto {
  @IsEnum(CommunityStatus)
  status: CommunityStatus;
}

class CreateReportDto {
  @IsEnum(CommunityReportTarget)
  targetType: CommunityReportTarget;

  @IsString()
  @MaxLength(500)
  reason: string;
}

@Controller('community')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get('posts')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ADMIN,
  )
  listPosts(
    @Query('take') take?: string,
    @Query('cursor') cursor?: string,
    @Query('tag') tag?: string,
    @Query('mine') mine?: string,
    @Request() req?: any,
  ) {
    const size = Math.min(Number(take) || 20, 50);
    const userId = mine === 'true' ? req?.user?.id : undefined;
    const isAdmin = req?.user?.role === UserRole.ADMIN;
    const statuses =
      mine === 'true' && userId
        ? [CommunityStatus.APPROVED, CommunityStatus.PENDING, CommunityStatus.REJECTED]
        : isAdmin
        ? undefined
        : [CommunityStatus.APPROVED];
    return this.communityService.listPosts(size, cursor, {
      userId,
      tag: tag?.trim() || undefined,
      statuses,
    });
  }

  @Get('posts/:id')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ADMIN,
  )
  getPost(@Param('id') id: string, @Request() req) {
    return this.communityService.getPost(id, req.user);
  }

  @Post('posts')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ADMIN,
  )
  createPost(@Body() body: CreatePostDto, @Request() req) {
    return this.communityService.createPost(req.user.id, body);
  }

  @Post('posts/:id/comments')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ADMIN,
  )
  addComment(@Param('id') id: string, @Body() body: CreateCommentDto, @Request() req) {
    return this.communityService.addComment(req.user.id, id, body.body);
  }

  @Delete('posts/:id')
  @Roles(UserRole.ADMIN)
  deletePost(@Param('id') id: string) {
    return this.communityService.deletePost(id);
  }

  @Delete('comments/:id')
  @Roles(UserRole.ADMIN)
  deleteComment(@Param('id') id: string) {
    return this.communityService.deleteComment(id);
  }

  @Get('admin/pending/posts')
  @Roles(UserRole.ADMIN)
  listPendingPosts() {
    return this.communityService.listPendingPosts();
  }

  @Get('admin/pending/comments')
  @Roles(UserRole.ADMIN)
  listPendingComments() {
    return this.communityService.listPendingComments();
  }

  @Patch('admin/posts/:id/status')
  @Roles(UserRole.ADMIN)
  updatePostStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    return this.communityService.updatePostStatus(id, body.status);
  }

  @Patch('admin/comments/:id/status')
  @Roles(UserRole.ADMIN)
  updateCommentStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    return this.communityService.updateCommentStatus(id, body.status);
  }

  @Patch('admin/posts/:id/pin')
  @Roles(UserRole.ADMIN)
  setPostPinned(@Param('id') id: string, @Body() body: { isPinned: boolean }) {
    return this.communityService.setPostPinned(id, Boolean(body.isPinned));
  }

  @Post('reports/:id')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ADMIN,
  )
  createReport(@Param('id') id: string, @Body() body: CreateReportDto, @Request() req) {
    return this.communityService.createReport(
      req.user.id,
      body.targetType,
      id,
      body.reason,
    );
  }

  @Get('admin/reports')
  @Roles(UserRole.ADMIN)
  listReports() {
    return this.communityService.listReports();
  }

  @Patch('admin/reports/:id/resolve')
  @Roles(UserRole.ADMIN)
  resolveReport(@Param('id') id: string) {
    return this.communityService.resolveReport(id);
  }
}
