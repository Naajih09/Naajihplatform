import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class KeepAliveService implements OnModuleInit {
  private readonly logger = new Logger(KeepAliveService.name);
  private readonly keepAliveUrl: string | null;

  constructor(private readonly configService: ConfigService) {
    const configuredUrl =
      this.configService.get<string>('KEEP_ALIVE_URL') ||
      this.configService.get<string>('BACKEND_URL') ||
      this.configService.get<string>('APP_BASE_URL');

    this.keepAliveUrl = configuredUrl
      ? this.normalizeKeepAliveUrl(configuredUrl)
      : null;
  }

  onModuleInit() {
    if (!this.keepAliveUrl) {
      this.logger.log(
        'Keep-alive ping is disabled. Set KEEP_ALIVE_URL to enable it.',
      );
      return;
    }

    this.logger.log(`Keep-alive ping enabled for ${this.keepAliveUrl}`);
  }

  @Cron('*/10 * * * *')
  async ping() {
    if (!this.keepAliveUrl) {
      return;
    }

    try {
      const response = await fetch(this.keepAliveUrl, { method: 'HEAD' });

      if (!response.ok) {
        this.logger.warn(
          `Keep-alive ping returned ${response.status} ${response.statusText}`,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Keep-alive ping failed: ${message}`);
    }
  }

  private normalizeKeepAliveUrl(configuredUrl: string) {
    const trimmedUrl = configuredUrl.trim().replace(/\/$/, '');

    if (trimmedUrl.endsWith('/health')) {
      return trimmedUrl;
    }

    try {
      return `${new URL(trimmedUrl).origin}/health`;
    } catch {
      return `${trimmedUrl}/health`;
    }
  }
}
