import { Module } from '@nestjs/common';
import { PitchesService } from './pitches.service';
import { PitchesController } from './pitches.controller';
import { PrismaService } from '../prisma.service'; 

@Module({
  controllers: [PitchesController],
  providers: [PitchesService, PrismaService], 
})
export class PitchesModule {}