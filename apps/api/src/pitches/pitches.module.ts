import { Module } from '@nestjs/common';
import { PitchesService } from './pitches.service';
import { PitchesController } from './pitches.controller';
import { PrismaService } from '../prisma.service'; // <--- Import this

@Module({
  controllers: [PitchesController],
  providers: [PitchesService, PrismaService], // <--- Add it here
})
export class PitchesModule {}