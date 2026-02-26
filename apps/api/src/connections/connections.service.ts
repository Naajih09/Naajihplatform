import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ConnectionsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

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

    const connection = await this.databaseService.connection.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING',
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
    const connection = await this.databaseService.connection.update({
      where: { id },
      data: { status },
      include: { receiver: { include: { entrepreneurProfile: true, investorProfile: true } } }
    });

    if (status === 'ACCEPTED') {
      const receiverName = connection.receiver?.entrepreneurProfile?.firstName || connection.receiver?.investorProfile?.firstName || 'Someone';
      await this.notificationsService.create(connection.senderId, `${receiverName} accepted your connection request.`);
    }

    return connection;
  }
}