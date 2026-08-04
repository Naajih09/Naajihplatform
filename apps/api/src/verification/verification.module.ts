import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuditModule } from '../audit/audit.module';
import { AccessPolicyModule } from '../policies/access-policy.module';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import {
  DojahVerificationProvider,
  SmileIdVerificationProvider,
  VerifyMeVerificationProvider,
} from './providers/external-placeholder.provider';
import { InternalSandboxVerificationProvider } from './providers/internal-sandbox.provider';
import { VerificationProviderRegistry } from './providers/verification-provider.registry';

@Module({
  imports: [
    DatabaseModule,
    NotificationsModule,
    AuditModule,
    AccessPolicyModule,
  ],
  controllers: [VerificationController],
  providers: [
    VerificationService,
    VerificationProviderRegistry,
    InternalSandboxVerificationProvider,
    DojahVerificationProvider,
    SmileIdVerificationProvider,
    VerifyMeVerificationProvider,
  ],
})
export class VerificationModule {}
