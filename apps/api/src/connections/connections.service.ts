import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ConnectionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1. SEND CONNECTION REQUEST
  async create(data: any) {
    const { senderId, receiverId } = data;

    // Check if connection already exists
    const existing = await this.databaseService.connection.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) throw new Error('Connection already exists or is pending');

    return this.databaseService.connection.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING',
      },
    });
  }

  // 2. GET MY CONNECTIONS (Accepted)
  async getMyConnections(userId: string) {
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

  // 3. GET PENDING REQUESTS (Waiting for me to accept)
  async getPendingRequests(userId: string) {
    return this.databaseService.connection.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      include: {
        sender: { include: { entrepreneurProfile: true, investorProfile: true } },
      },
    });
  }

  // 4. ACCEPT / REJECT REQUEST
  async respond(id: string, status: 'ACCEPTED' | 'REJECTED') {
    return this.databaseService.connection.update({
      where: { id },
      data: { status },
    });
  }
}