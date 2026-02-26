import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { AcademyController } from './academy.controller';
import { AcademyService } from './academy.service';

@Module({
  controllers: [AcademyController],
  providers: [AcademyService],
  imports: [DatabaseModule],
})
export class AcademyModule {}
