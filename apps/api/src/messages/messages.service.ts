import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { sanitizePlainText } from '../utils/sanitize';

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
    return this.databaseService.message.create({
      data: {
        content: sanitizePlainText(data.content),
        senderId: data.senderId,
        receiverId: data.receiverId,
        attachmentUrl: data.attachmentUrl,
        type: data.type || 'TEXT',
      },
    });
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
}
