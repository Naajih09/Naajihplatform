import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  // 1. GET MY NOTIFICATIONS
  async findAll(userId: string) {
    return this.databaseService.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10 // Limit to last 10
    });
  }

  // 2. CREATE NOTIFICATION (Internal use)
  async create(userId: string, message: string) {
    const notification = await this.databaseService.notification.create({
      data: { userId, message }
    });

    // Send real-time
    this.notificationsGateway.sendNotification(userId, notification);

    return notification;
  }

  // 3. MARK AS READ
  async markRead(id: string) {
    return this.databaseService.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }
}