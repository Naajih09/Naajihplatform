import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PitchesService } from './pitches.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Query } from '@nestjs/common';
import { Patch, Delete } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

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
        connect: { id: req.user.id },
      },
    });
  }

  //  Investors can see list without login
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.pitchesService.findAll({
      search,
      category,
      status,
      page,
      pageSize,
    });
  }

  // Admin-only list with filters + pagination
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin')
  findAllAdmin(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.pitchesService.findAll({
      search,
      category,
      status,
      page,
      pageSize,
    });
  }

  // Admin stats
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/stats')
  getAdminStats() {
    return this.pitchesService.getAdminStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('recommended')
  getRecommended(@Request() req: any) {
    return this.pitchesService.getRecommended(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pitchesService.findOne(id);
  }
  // PATCH /api/pitches/:id
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.pitchesService.update(id, body, req.user.id);
  }

  // DELETE /api/pitches/:id (Admin only)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pitchesService.remove(id);
  }
}
