import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { MailerService } from '../mailer/mailer.service';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailerService: MailerService,
  ) {}

  async create(dto: CreateWaitlistDto) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const existing = await this.databaseService.waitlist.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return existing;
    }

    const created = await this.databaseService.waitlist.create({
      data: {
        email: normalizedEmail,
        role: dto.role,
        firstName: dto.firstName,
        lastName: dto.lastName,
        location: dto.location,
        message: dto.message,
      },
    });

    // Try to send a simple confirmation email (non-blocking)
    try {
      await this.mailerService.sendMail(
        created.email,
        'You are on the Naajih waitlist',
        `<p>Thanks for signing up. We'll notify you when access opens.</p>`,
      );
    } catch (err) {
      this.logger.warn('Failed to send waitlist email: ' + String(err));
    }

    return created;
  }

  async list(limit = 100) {
    return this.databaseService.waitlist.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markNotified(id: string) {
    return this.databaseService.waitlist.update({
      where: { id },
      data: { isNotified: true },
    });
  }

  async invite(ids: string[], message = '') {
    if (!Array.isArray(ids) || ids.length === 0) return { processed: 0 };

    const results: any[] = [];

    for (const id of ids) {
      try {
        const entry = await this.databaseService.waitlist.findUnique({
          where: { id },
        });
        if (!entry) continue;

        // Mark as notified
        const updated = await this.databaseService.waitlist.update({
          where: { id },
          data: { isNotified: true },
        });

        // Send invite email (best-effort)
        try {
          const html = `
            <p>Hi ${entry.firstName || 'there'},</p>
            <p>${message || 'Good news — access to Naajih is now available. Click the link below to sign in when invited.'}</p>
            <p><a href="${process.env.FRONTEND_URL || 'https://app.naajihbiz.com'}/login">Open Naajih</a></p>
          `;
          await this.mailerService.sendMail(entry.email, 'You are invited to Naajih', html);
        } catch (err) {
          this.logger.warn(`Failed to send invite to ${entry.email}: ${String(err)}`);
        }

        results.push(updated);
      } catch (err) {
        this.logger.error(`Error processing waitlist id=${id}: ${String(err)}`);
      }
    }

    return { processed: results.length, results };
  }
}
