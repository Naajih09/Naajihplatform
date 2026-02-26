import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AcademyService } from './academy.service';

@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  @Get()
  findAll() {
    return this.academyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.academyService.findOne(id, userId);
  }

  @Post('lesson/:lessonId/complete')
  completeLesson(@Param('lessonId') lessonId: string, @Body('userId') userId: string) {
    return this.academyService.completeLesson(userId, lessonId);
  }

  @Get('lesson/:id')
  getLesson(@Param('id') id: string) {
    return this.academyService.getLesson(id);
  }

  @Post('seed')
  seed() {
    return this.academyService.seed();
  }
}