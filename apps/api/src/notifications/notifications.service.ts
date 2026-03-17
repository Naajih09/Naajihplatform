import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationsGateway } from './notifications.gateway';
import { MailerService } from '../mailer/mailer.service';
import { notificationEmail } from '../mailer/templates';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsGateway: NotificationsGateway,
    private readonly mailerService: MailerService,
  ) {}

  private get emailEnabled() {
    return process.env.NOTIFICATION_EMAIL_ENABLED === 'true';
  }

  // 1. GET MY NOTIFICATIONS
  async findAll(userId: string) {
    return this.databaseService.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to last 10
    });
  }

  // 2. CREATE NOTIFICATION (Internal use)
  async create(userId: string, message: string) {
    const notification = await this.databaseService.notification.create({
      data: { userId, message },
    });

    // Send real-time
    this.notificationsGateway.sendNotification(userId, notification);

    if (this.emailEnabled) {
      const user = await this.databaseService.user.findUnique({
        where: { id: userId },
        select: { email: true, emailVerified: true },
      });
      if (user?.email && user.emailVerified) {
        await this.mailerService.sendMail(
          user.email,
          'Naajih Notification',
          notificationEmail(message),
        );
      }
    }

    return notification;
  }

  // 3. MARK AS READ
  async markRead(id: string) {
    return this.databaseService.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }
}
