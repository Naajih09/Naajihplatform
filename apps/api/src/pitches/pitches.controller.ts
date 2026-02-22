import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PitchesService } from './pitches.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { Query } from '@nestjs/common';
import { Patch, Delete } from '@nestjs/common';

@Controller('pitches')
export class PitchesController {
  constructor(private readonly pitchesService: PitchesService) {}

//  Only logged-in users can post
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPitchDto: any, @Request() req: any) {
    return this.pitchesService.create({
      ...createPitchDto,
      user: {
        connect: { id: req.user.id } 
      }
    });
  }

  //  Investors can see list without login 
  @Get()
  findAll(@Query('search') search?: string, @Query('category') category?: string) {
    return this.pitchesService.findAll({ search, category });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pitchesService.findOne(id);
  }
  // PATCH /api/pitches/:id
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.pitchesService.update(id, body);
  }

  // DELETE /api/pitches/:id
  //@UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pitchesService.remove(id);
  }
}
