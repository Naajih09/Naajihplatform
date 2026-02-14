import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly databaseService: DatabaseService) {}

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
    return this.databaseService.notification.create({
      data: { userId, message }
    });
  }

  // 3. MARK AS READ
  async markRead(id: string) {
    return this.databaseService.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }
}