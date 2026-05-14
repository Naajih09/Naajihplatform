import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private getFrom() {
    return process.env.SMTP_FROM || 'NaajihBiz <noreply@naajihbiz.com>';
  }

  private getResendApiKey() {
    const explicitKey = process.env.RESEND_API_KEY;
    if (explicitKey) return explicitKey;

    const smtpHost = process.env.SMTP_HOST;
    const smtpPass = process.env.SMTP_PASS;
    if (smtpHost === 'smtp.resend.com' && smtpPass?.startsWith('re_')) {
      return smtpPass;
    }

    return undefined;
  }

  private getTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    const from = this.getFrom();
    const resendApiKey = this.getResendApiKey();

    if (resendApiKey) {
      try {
        await axios.post(
          'https://api.resend.com/emails',
          { from, to, subject, html },
          {
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          },
        );
        return true;
      } catch (error: any) {
        const detail = error?.response?.data
          ? JSON.stringify(error.response.data)
          : error instanceof Error
            ? error.message
            : String(error);
        this.logger.error(`Resend email failed for ${to}: ${detail}`);
        return false;
      }
    }

    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.warn('SMTP not configured. Email skipped.');
      return false;
    }

    try {
      await transporter.sendMail({ from, to, subject, html });
      return true;
    } catch (error) {
      this.logger.error(
        `Email failed for ${to}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return false;
    }
  }
}
