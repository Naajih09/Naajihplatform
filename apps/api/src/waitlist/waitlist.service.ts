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

  async invite(ids: string[], message = '') {
    if (!Array.isArray(ids) || ids.length === 0) return { processed: 0 };

    const results: any[] = [];
    const failed: string[] = [];

    for (const id of ids) {
      try {
        const entry = await this.databaseService.waitlist.findUnique({
          where: { id },
        });
        if (!entry) continue;

        const safeMessage = message
          ? this.escapeHtml(message).replace(/\r?\n/g, '<br>')
          : 'Good news — access to Naajih is now available. Click below to sign in.';
        const html = `
          <p>Hi ${this.escapeHtml(entry.firstName || 'there')},</p>
          <p>${safeMessage}</p>
          <p><a href="${this.getLoginUrl()}">Open Naajih</a></p>
        `;
        const delivered = await this.mailerService.sendMail(
          entry.email,
          'You are invited to Naajih',
          html,
        );

        if (!delivered) {
          failed.push(id);
          continue;
        }

        const updated = await this.databaseService.waitlist.update({
          where: { id },
          data: { isNotified: true },
        });
        results.push(updated);
      } catch (err) {
        this.logger.error(`Error processing waitlist id=${id}: ${String(err)}`);
        failed.push(id);
      }
    }

    return { processed: results.length, results, failed: failed.length, failedIds: failed };
  }

  private escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => {
      const entities: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      };
      return entities[character];
    });
  }

  private getLoginUrl() {
    const frontendUrl = (process.env.FRONTEND_URL || 'https://app.naajihbiz.com')
      .trim()
      .replace(/\/+$/, '');
    return `${frontendUrl}/login`;
  }
}
