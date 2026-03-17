import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MailerModule } from '../mailer/mailer.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [DatabaseModule, MailerModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService],
})
export class NotificationsModule {}
