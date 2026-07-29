import { Module } from '@nestjs/common';
import { PitchesService } from './pitches.service';
import { PitchesController } from './pitches.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AccessPolicyModule } from '../policies/access-policy.module';

@Module({
  imports: [AuthModule, AuditModule, NotificationsModule, AccessPolicyModule],
  controllers: [PitchesController],
  providers: [PitchesService, PrismaService],
})
export class PitchesModule {}
