import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AcademyController } from './academy.controller';
import { AcademyService } from './academy.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { AcademyPublicController } from './academy.public.controller';
import { MailerModule } from '../mailer/mailer.module';
import { AcademyCohortNotificationsService } from './academy.cohort-notifications.service';
import { AccessPolicyModule } from '../policies/access-policy.module';

@Module({
  controllers: [AcademyController, AcademyPublicController],
  providers: [AcademyService, AcademyCohortNotificationsService],
  imports: [
    DatabaseModule,
    NotificationsModule,
    MailerModule,
    AccessPolicyModule,
  ],
})
export class AcademyModule {}
