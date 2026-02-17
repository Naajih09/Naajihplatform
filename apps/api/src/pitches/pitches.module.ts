import { Module } from '@nestjs/common';
import { PitchesService } from './pitches.service';
import { PitchesController } from './pitches.controller';
import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [AuthModule], 
  controllers: [PitchesController],
  providers: [PitchesService, PrismaService],
})
export class PitchesModule {}