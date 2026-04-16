import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AcademyService } from './academy.service';

@Controller('academy/public')
export class AcademyPublicController {
  constructor(private readonly academyService: AcademyService) {}

  @Get('verify')
  @Throttle({ short: { limit: 10, ttl: 60000 } })
  verifyCertificate(
    @Query('token') token?: string,
    @Query('programId') programId?: string,
    @Query('userId') userId?: string,
  ) {
    if (token) {
      return this.academyService.verifyCertificateByToken(token);
    }
    return this.academyService.verifyCertificate(programId, userId);
  }
}
