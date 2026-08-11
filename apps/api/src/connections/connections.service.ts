// apps/api/src/connections/connections.service.ts
import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { ConnectionStatus, PitchStatus, UserRole } from '@prisma/client'; // NEW: Import ConnectionStatus enum
import { AccessPolicyService } from '../policies/access-policy.service';

@Injectable()
export class ConnectionsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
    private readonly accessPolicy: AccessPolicyService,
  ) {}

  // NEW: findOne method for the controller's authorization checks
  async findOne(id: string) {
    return this.databaseService.connection.findUnique({
      where: { id },
    });
  }

  // 1. SEND CONNECTION REQUEST
  async create(data: {
    senderId: string;
    receiverId: string;
    pitchId?: string;
  }) {
    const { senderId, receiverId, pitchId } = data;

    if (senderId === receiverId) {
      throw new ConflictException('You cannot connect with yourself.');
    }

    const sender = await this.databaseService.user.findUnique({
      where: { id: senderId },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
        subscription: true,
      },
    });

    if (!sender) {
      throw new NotFoundException('User not found');
    }

    this.accessPolicy.assertCanConnect(sender);

    const receiver = await this.databaseService.user.findUnique({
      where: { id: receiverId },
      select: { id: true, role: true },
    });

    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }

    if (sender.role === UserRole.INVESTOR) {
      if (!pitchId) {
        throw new ForbiddenException(
          'An approved pitch is required before connecting with this founder.',
        );
      }

      const pitch = await this.databaseService.pitch.findFirst({
        where: {
          id: pitchId,
          userId: receiverId,
        },
        select: { id: true, status: true },
      });

      if (!pitch || pitch.status !== PitchStatus.APPROVED) {
        throw new ForbiddenException('This pitch is pending review');
      }
    }

    // Check if connection already exists
    const existing = await this.databaseService.connection.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existing) {
      // Use ConnectionStatus enum
      throw new ConflictException(
        `Connection already exists or is ${existing.status.toLowerCase()}`,
      );
    }

    const connection = await this.databaseService.connection.create({
      data: {
        senderId,
        receiverId,
        status: ConnectionStatus.PENDING, // Use enum here
      },
    });

    // Notify receiver
    const senderName =
      sender?.entrepreneurProfile?.firstName ||
      sender?.investorProfile?.firstName ||
      'Someone';
    await this.notificationsService.create(
      receiverId,
      `${senderName} sent you a connection request.`,
    );

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
        sender: {
          include: { entrepreneurProfile: true, investorProfile: true },
        },
        receiver: {
          include: { entrepreneurProfile: true, investorProfile: true },
        },
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
        sender: {
          include: { entrepreneurProfile: true, investorProfile: true },
        },
      },
    });
  }

  async getSentRequests(userId: string) {
    return this.databaseService.connection.findMany({
      where: {
        senderId: userId,
        status: {
          in: [ConnectionStatus.PENDING, ConnectionStatus.ACCEPTED],
        },
      },
      include: {
        receiver: {
          include: { entrepreneurProfile: true, investorProfile: true },
        },
      },
    });
  }

  // 4. ACCEPT / REJECT REQUEST
  async respond(id: string, status: 'ACCEPTED' | 'REJECTED') {
    const connection = await this.databaseService.connection.update({
      where: { id },
      data: { status: ConnectionStatus[status] }, // Convert string to enum member
      include: {
        receiver: {
          include: { entrepreneurProfile: true, investorProfile: true },
        },
      },
    });

    if (status === 'ACCEPTED') {
      const receiverName =
        connection.receiver?.entrepreneurProfile?.firstName ||
        connection.receiver?.investorProfile?.firstName ||
        'Someone';
      await this.notificationsService.create(
        connection.senderId,
        `${receiverName} accepted your connection request.`,
      );
    }

    return connection;
  }

  async submitFeedback(
    connectionId: string,
    reviewerId: string,
    data: { rating?: number; flagReason?: string; note?: string },
  ) {
    const connection = await this.databaseService.connection.findUnique({
      where: { id: connectionId },
    });

    if (!connection || connection.status !== ConnectionStatus.ACCEPTED) {
      throw new NotFoundException('Accepted connection not found');
    }

    if (
      connection.senderId !== reviewerId &&
      connection.receiverId !== reviewerId
    ) {
      throw new ForbiddenException(
        'You can only review your own accepted connections.',
      );
    }

    const rating =
      typeof data.rating === 'number' && data.rating >= 1 && data.rating <= 5
        ? Math.round(data.rating)
        : null;
    const flagReason = String(data.flagReason || '').trim() || null;
    const note = String(data.note || '').trim() || null;

    if (!rating && !flagReason && !note) {
      throw new ForbiddenException('Add a rating, flag, or note.');
    }

    const revieweeId =
      connection.senderId === reviewerId
        ? connection.receiverId
        : connection.senderId;

    return this.databaseService.connectionFeedback.upsert({
      where: {
        connectionId_reviewerId: {
          connectionId,
          reviewerId,
        },
      },
      update: { rating, flagReason, note },
      create: {
        connectionId,
        reviewerId,
        revieweeId,
        rating,
        flagReason,
        note,
      },
    });
  }

  // 5. REMOVE / CANCEL CONNECTION (NEW)
  async removeConnection(id: string, userId: string, isAdmin = false) {
    const connection = await this.databaseService.connection.findUnique({
      where: { id },
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    // Authorization: Only people involved in the connection can delete it
    if (
      !isAdmin &&
      connection.senderId !== userId &&
      connection.receiverId !== userId
    ) {
      throw new UnauthorizedException(
        'Not authorized to modify this connection',
      );
    }

    return this.databaseService.connection.delete({
      where: { id },
    });
  }
}
