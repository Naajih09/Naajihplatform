import { Module } from '@nestjs/common';
import { AppCacheModule } from '../cache/app-cache.module';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [AppCacheModule, DatabaseModule, NotificationsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
