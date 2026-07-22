import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { sanitizePlainText } from '../utils/sanitize';

const riskyMessagePattern =
  /(whats\s?app|wa\.me|telegram|t\.me|outside\s+(the\s+)?platform|off[-\s]?platform|bank\s+transfer|send\s+money|pay\s+me|gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|\+?\d[\d\s().-]{7,}\d)/i;

const messageUserInclude = {
  entrepreneurProfile: true,
  investorProfile: true,
};

@Injectable()
export class MessagesService {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1. SEND MESSAGE
  async create(data: {
    content?: string;
    senderId: string;
    receiverId: string;
    attachmentUrl?: string;
    type?: string;
  }) {
    const sender = await this.databaseService.user.findUnique({
      where: { id: data.senderId },
      select: { id: true, isVerified: true },
    });

    if (!sender?.isVerified) {
      throw new ForbiddenException(
        'Verify your account to unlock this feature',
      );
    }

    const content = sanitizePlainText(data.content);

    const message = await this.databaseService.message.create({
      data: {
        content,
        senderId: data.senderId,
        receiverId: data.receiverId,
        attachmentUrl: data.attachmentUrl,
        type: data.type || 'TEXT',
      },
    });

    if (content && riskyMessagePattern.test(content)) {
      await this.databaseService.messageReport.create({
        data: {
          reporterId: data.receiverId,
          reportedUserId: data.senderId,
          messageId: message.id,
          source: 'SYSTEM_FLAG',
          reason:
            'Message may include off-platform contact details or payment language.',
        },
      });
    }

    return message;
  }

  // 2. GET CONVERSATION (Between User A and User B)
  async getConversation(user1: string, user2: string) {
    return this.databaseService.message.findMany({
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          include: { entrepreneurProfile: true, investorProfile: true },
        },
      },
    });
  }

  async getUnreadCount(userId: string) {
    const count = await this.databaseService.message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    return { count };
  }

  async markConversationAsRead(userId: string, otherId: string) {
    const result = await this.databaseService.message.updateMany({
      where: {
        senderId: otherId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });

    return { count: result.count };
  }

  // 3. GET MY CHAT LIST
  async getMyChatPartners(userId: string) {
    // Find all connections where status is ACCEPTED
    return this.databaseService.connection.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }], // Note: If your schema uses 'requesterId' instead of 'senderId', change it here.
        status: 'ACCEPTED',
      },
      include: {
        sender: {
          include: { entrepreneurProfile: true, investorProfile: true },
        },
        receiver: {
          include: { entrepreneurProfile: true, investorProfile: true },
        },
      },
    });
  }

  // 4. MARK MESSAGE AS READ
  async markAsRead(messageId: string, userId: string) {
    const message = await this.databaseService.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Authorization: Only the receiver can mark a message as read
    if (message.receiverId !== userId) {
      throw new UnauthorizedException('You can only read messages sent to you');
    }

    return this.databaseService.message.update({
      where: { id: messageId },
      data: { isRead: true }, // Assuming 'isRead' exists in your Prisma schema
    });
  }

  // 5. DELETE/UNSEND MESSAGE
  async deleteMessage(messageId: string, userId: string) {
    const message = await this.databaseService.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Authorization: Only the sender can delete their own message
    if (message.senderId !== userId) {
      throw new UnauthorizedException('You can only delete your own messages');
    }

    return this.databaseService.message.delete({
      where: { id: messageId },
    });
  }

  async reportConversation(data: {
    reporterId: string;
    reportedUserId: string;
    messageId?: string;
    reason?: string;
  }) {
    if (data.reporterId === data.reportedUserId) {
      throw new ForbiddenException('You cannot report yourself.');
    }

    const message = data.messageId
      ? await this.databaseService.message.findUnique({
          where: { id: data.messageId },
        })
      : null;

    if (
      message &&
      !(
        (message.senderId === data.reporterId &&
          message.receiverId === data.reportedUserId) ||
        (message.senderId === data.reportedUserId &&
          message.receiverId === data.reporterId)
      )
    ) {
      throw new ForbiddenException(
        'You can only report your own conversation.',
      );
    }

    const existingConnection = await this.databaseService.connection.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: data.reporterId, receiverId: data.reportedUserId },
          { senderId: data.reportedUserId, receiverId: data.reporterId },
        ],
      },
    });

    if (!existingConnection && !message) {
      throw new ForbiddenException(
        'You can only report connected conversations.',
      );
    }

    return this.databaseService.messageReport.create({
      data: {
        reporterId: data.reporterId,
        reportedUserId: data.reportedUserId,
        messageId: data.messageId,
        reason:
          sanitizePlainText(data.reason) || 'User reported this conversation.',
        source: 'USER_REPORT',
      },
      include: {
        reporter: { include: messageUserInclude },
        reportedUser: { include: messageUserInclude },
        message: true,
      },
    });
  }

  async getAdminReports(status?: string) {
    const where =
      status && status !== 'ALL' ? { status: status.toUpperCase() } : {};

    return this.databaseService.messageReport.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { include: messageUserInclude },
        reportedUser: { include: messageUserInclude },
        message: {
          include: {
            sender: { include: messageUserInclude },
            receiver: { include: messageUserInclude },
          },
        },
      },
    });
  }

  async getAdminConversation(reportId: string) {
    const report = await this.databaseService.messageReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Message report not found');
    }

    if (!report.reporterId) {
      const message = report.messageId
        ? await this.databaseService.message.findUnique({
            where: { id: report.messageId },
          })
        : null;

      if (!message) {
        return [];
      }

      return this.getConversation(message.senderId, message.receiverId);
    }

    return this.getConversation(report.reporterId, report.reportedUserId);
  }

  async resolveReport(reportId: string) {
    return this.databaseService.messageReport.update({
      where: { id: reportId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date(),
      },
    });
  }
}
