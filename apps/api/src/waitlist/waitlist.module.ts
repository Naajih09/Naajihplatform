import { Module } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { WaitlistController } from './waitlist.controller';
import { DatabaseModule } from '../database/database.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [DatabaseModule, MailerModule],
  providers: [WaitlistService],
  controllers: [WaitlistController],
  exports: [WaitlistService],
})
export class WaitlistModule {}
