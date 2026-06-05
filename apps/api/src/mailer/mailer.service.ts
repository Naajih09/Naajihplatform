import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);

  private getFrom() {
    return (
      process.env.RESEND_FROM ||
      process.env.SMTP_FROM ||
      'NaajihBiz <noreply@naajihbiz.com>'
    );
  }

  private getResendApiKey() {
    return process.env.RESEND_API_KEY;
  }

  private getTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const timeout = Number(process.env.SMTP_TIMEOUT_MS || 10000);
    const timeoutMs = Number.isFinite(timeout) && timeout > 0 ? timeout : 10000;

    if (!host || !user || !pass) {
      return null;
    }

    const options: SMTPTransport.Options = {
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: timeoutMs,
      greetingTimeout: timeoutMs,
      socketTimeout: timeoutMs,
    };

    if (process.env.SMTP_REQUIRE_TLS === 'true') {
      options.requireTLS = true;
    }

    if (process.env.SMTP_REJECT_UNAUTHORIZED === 'false') {
      options.tls = { rejectUnauthorized: false };
    }

    return nodemailer.createTransport(options);
  }

  async verifyConnection() {
    if (this.getResendApiKey()) {
      return true;
    }

    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.warn('SMTP not configured. Email delivery is disabled.');
      return false;
    }

    try {
      await transporter.verify();
      return true;
    } catch (error) {
      this.logger.error(
        `SMTP verification failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return false;
    }
  }

  private async sendWithResend(to: string, subject: string, html: string) {
    const apiKey = this.getResendApiKey();

    if (!apiKey) {
      return null;
    }

    const from = this.getFrom();

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, subject, html }),
      });

      if (response.ok) {
        return true;
      }

      const body = await response.text().catch(() => '');
      this.logger.error(
        `Resend email failed for ${to}: HTTP ${response.status}${
          body ? ` - ${body}` : ''
        }`,
      );
      return false;
    } catch (error) {
      this.logger.error(
        `Resend email failed for ${to}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      return false;
    }
  }

  private async sendWithSmtp(to: string, subject: string, html: string) {
    const from = this.getFrom();
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

  async sendMail(to: string, subject: string, html: string) {
    const resendResult = await this.sendWithResend(to, subject, html);

    if (resendResult === true) {
      return true;
    }

    if (resendResult === false) {
      this.logger.warn('Falling back to SMTP after Resend delivery failed.');
    }

    return this.sendWithSmtp(to, subject, html);
  }
}
