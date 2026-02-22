import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AcademyService } from './acedemy.service';

@Controller('academy')
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  @Get()
  findAll() {
    return this.academyService.findAll();
  }

  @Post('seed') // Call this once to create data!
  seed() {
    return this.academyService.seed();
  }

  @Get(':id/user/:userId')
  findOne(@Param('id') id: string, @Param('userId') userId: string) {
    return this.academyService.findOne(id, userId);
  }

  @Post('complete')
  completeLesson(@Body() body: { userId: string, lessonId: string }) {
    return this.academyService.completeLesson(body.userId, body.lessonId);
  }
}