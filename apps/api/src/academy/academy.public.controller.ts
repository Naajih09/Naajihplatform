import { Controller, Get, Query } from '@nestjs/common';
import { AcademyService } from './academy.service';

@Controller('academy/public')
export class AcademyPublicController {
  constructor(private readonly academyService: AcademyService) {}

  @Get('verify')
  verifyCertificate(
    @Query('programId') programId: string,
    @Query('userId') userId: string,
  ) {
    return this.academyService.verifyCertificate(programId, userId);
  }
}
