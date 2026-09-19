import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { WaitlistService } from './waitlist.service';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';
import { InviteWaitlistDto } from './dto/invite-waitlist.dto';
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

  // Admin: list waitlist entries (protected)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  list(@Query('limit') limit = '100') {
    const n = Number(limit) || 100;
    return this.waitlistService.list(n);
  }

  // Admin: mark an entry as notified
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/notify')
  async markNotified(@Param('id') id: string) {
    return this.waitlistService.markNotified(id);
  }

  // Admin: invite multiple waitlist entries (mark notified + send invite email)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('invite')
  async invite(@Body() dto: InviteWaitlistDto) {
    return this.waitlistService.invite(dto.ids || [], dto.message || '');
  }
}
