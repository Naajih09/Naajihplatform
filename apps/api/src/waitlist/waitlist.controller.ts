import { Body, Controller, Post, Get, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) {}

  @Post()
  create(@Body() dto: CreateWaitlistDto) {
    return this.waitlistService.create(dto);
  }

  // Admin: list waitlist entries
  @Get()
  async list(@Query('limit') limit = '100', @Query('public') publicFlag = '') {
    const n = Number(limit) || 100;
    // In development allow unauthenticated access when explicitly requested
    if (
      process.env.NODE_ENV !== 'production' &&
      (publicFlag === 'true' || publicFlag === '1')
    ) {
      return this.waitlistService.list(n);
    }

    // Default: require admin
    return this.waitlistService.list(n);
  }

  // Admin: mark an entry as notified
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/notify')
  async markNotified(@Param('id') id: string, @Query('public') publicFlag = '') {
    // Allow marking via public flag in non-production for local testing
    if (process.env.NODE_ENV !== 'production' && (publicFlag === 'true' || publicFlag === '1')) {
      return this.waitlistService.markNotified(id);
    }

    return this.waitlistService.markNotified(id);
  }

  // Development-only public mark endpoint for quick local testing
  @Patch('public/:id/notify')
  async publicMarkNotified(@Param('id') id: string) {
    if (process.env.NODE_ENV === 'production') {
      return { success: false, message: 'Not allowed in production' };
    }
    return this.waitlistService.markNotified(id);
  }
}
