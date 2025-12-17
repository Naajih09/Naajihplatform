import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PitchesService } from './pitches.service';
import { Prisma } from '@prisma/client';

@Controller('pitches')
export class PitchesController {
  constructor(private readonly pitchesService: PitchesService) {}

  @Post()
  create(@Body() createPitchDto: Prisma.PitchCreateInput) {
    return this.pitchesService.create(createPitchDto);
  }

  @Get()
  findAll() {
    return this.pitchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pitchesService.findOne(id);
  }
}