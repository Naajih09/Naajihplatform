// apps/api/src/connections/connections.service.ts
import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConnectionStatus } from '@prisma/client'; // NEW: Import ConnectionStatus enum

@Injectable()
export class ConnectionsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // NEW: findOne method for the controller's authorization checks
  async findOne(id: string) {
    return this.databaseService.connection.findUnique({
      where: { id },
    });
  }

  // 1. SEND CONNECTION REQUEST
  async create(data: { senderId: string; receiverId: string }) {
    const { senderId, receiverId } = data;

    if (senderId === receiverId) {
      throw new ConflictException('You cannot connect with yourself.');
    }

    // Check if connection already exists
    const existing = await this.databaseService.connection.findFirst({
      where: {
        OR:[
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      // Use ConnectionStatus enum
      throw new ConflictException(`Connection already exists or is ${existing.status.toLowerCase()}`);
    }

    const connection = await this.databaseService.connection.create({
      data: {
        senderId,
        receiverId,
        status: ConnectionStatus.PENDING, // Use enum here
      },
    });

    // Notify receiver
    const sender = await this.databaseService.user.findUnique({
      where: { id: senderId },
      include: { entrepreneurProfile: true, investorProfile: true }
    });
    const senderName = sender?.entrepreneurProfile?.firstName || sender?.investorProfile?.firstName || 'Someone';
    await this.notificationsService.create(receiverId, `${senderName} sent you a connection request.`);

    return connection;
  }

  // 2. GET MY CONNECTIONS (Accepted)
  async getMyConnections(userId: string) {
    return this.databaseService.connection.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
        status: ConnectionStatus.ACCEPTED, // Use enum here
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
        status: ConnectionStatus.PENDING, // Use enum here
      },
      include: {
        sender: { include: { entrepreneurProfile: true, investorProfile: true } },
      },
    });
  }

  // 4. ACCEPT / REJECT REQUEST
  async respond(id: string, status: 'ACCEPTED' | 'REJECTED') {
    const connection = await this.databaseService.connection.update({
      where: { id },
      data: { status: ConnectionStatus[status] }, // Convert string to enum member
      include: { receiver: { include: { entrepreneurProfile: true, investorProfile: true } } }
    });

    if (status === 'ACCEPTED') {
      const receiverName = connection.receiver?.entrepreneurProfile?.firstName || connection.receiver?.investorProfile?.firstName || 'Someone';
      await this.notificationsService.create(connection.senderId, `${receiverName} accepted your connection request.`);
    }

    return connection;
  }

  // 5. REMOVE / CANCEL CONNECTION (NEW)
  async removeConnection(id: string, userId: string) {
    const connection = await this.databaseService.connection.findUnique({
      where: { id },
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    // Authorization: Only people involved in the connection can delete it
    if (connection.senderId !== userId && connection.receiverId !== userId) {
      throw new UnauthorizedException('Not authorized to modify this connection');
    }

    return this.databaseService.connection.delete({
      where: { id },
    });
  }
}