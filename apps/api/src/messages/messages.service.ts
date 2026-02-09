import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class MessagesService {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1. SEND MESSAGE
  async create(data: any) {
    return this.databaseService.message.create({
      data: {
        content: data.content,
        senderId: data.senderId,
        receiverId: data.receiverId,
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
        sender: { include: { entrepreneurProfile: true, investorProfile: true } }
      }
    });
  }

  // 3. GET MY CHAT LIST 
  async getMyChatPartners(userId: string) {
    // Find all connections where status is ACCEPTED
    return this.databaseService.connection.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: 'ACCEPTED',
      },
      include: {
        sender: { include: { entrepreneurProfile: true, investorProfile: true } },
        receiver: { include: { entrepreneurProfile: true, investorProfile: true } },
      },
    });
  }
}