import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuditModule } from '../audit/audit.module';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { AccessPolicyModule } from '../policies/access-policy.module';

@Module({
  imports: [
    DatabaseModule,
    NotificationsModule,
    AuditModule,
    AccessPolicyModule,
  ],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
