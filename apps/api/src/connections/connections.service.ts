import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConnectionsService {
  constructor(private prisma: PrismaService) {}

  // 1. SEND CONNECTION REQUEST
  async create(senderId: string, receiverId: string) {
    // Check if connection already exists
    const existing = await this.prisma.connection.findUnique({
      where: {
        senderId_receiverId: { senderId, receiverId }
      }
    });

    if (existing) return { message: 'Connection already exists' };

    return this.prisma.connection.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING'
      }
    });
  }

  // 2. GET MY CONNECTIONS (For Messages/Network page)
  async findAll(userId: string) {
    return this.prisma.connection.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      include: {
        sender: { include: { entrepreneurProfile: true, investorProfile: true } },
        receiver: { include: { entrepreneurProfile: true, investorProfile: true } }
      }
    });
  }
}