import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AccessPolicyService } from './access-policy.service';

@Module({
  imports: [DatabaseModule],
  providers: [AccessPolicyService],
  exports: [AccessPolicyService],
})
export class AccessPolicyModule {}
