import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';

@Module({
  imports: [DatabaseModule, NotificationsModule], 
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}