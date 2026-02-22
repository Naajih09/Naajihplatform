import { Module } from '@nestjs/common';
import { AcademyService } from './acedemy.service';
import { AcademyController } from './acedemy.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [AcademyController],
  providers: [AcademyService],
  imports: [DatabaseModule],
})
export class AcedemyModule {}
