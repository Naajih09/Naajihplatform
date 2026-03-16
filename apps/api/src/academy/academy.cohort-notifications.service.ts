import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';
import { MailerService } from '../mailer/mailer.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AcademyCohortNotificationsService {
  private readonly logger = new Logger(AcademyCohortNotificationsService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailerService: MailerService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // Run every day at 08:00 server time
  @Cron('0 8 * * *')
  async notifyUnlockedModules() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const modules = await this.databaseService.module.findMany({
      where: {
        unlockDate: {
          gte: start,
          lte: end,
        },
      },
      include: {
        program: { select: { id: true, title: true } },
      },
    });

    if (!modules.length) return;

    for (const mod of modules) {
      const enrollments = await this.databaseService.programEnrollment.findMany({
        where: {
          programId: mod.programId,
          status: 'APPROVED',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              entrepreneurProfile: { select: { firstName: true } },
              investorProfile: { select: { firstName: true } },
            },
          },
        },
      });

      for (const enrollment of enrollments) {
        const firstName =
          enrollment.user?.entrepreneurProfile?.firstName ||
          enrollment.user?.investorProfile?.firstName ||
          'Learner';

        const message = `New module unlocked: ${mod.title}`;
        await this.notificationsService.create(enrollment.userId, message);

        const email = enrollment.user?.email;
        if (!email) continue;

        const html = `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #111;">New module unlocked</h2>
            <p>Hi ${firstName},</p>
            <p>The module <strong>${mod.title}</strong> is now available in <strong>${mod.program?.title}</strong>.</p>
            <p>Log in to continue your learning journey.</p>
            <p style="margin-top: 24px; color: #555;">NaajihBiz Academy</p>
          </div>
        `;

        try {
          await this.mailerService.sendMail(
            email,
            `Module unlocked: ${mod.title}`,
            html,
          );
        } catch (error) {
          this.logger.warn(`Email failed for ${email}`);
        }
      }
    }
  }
}
