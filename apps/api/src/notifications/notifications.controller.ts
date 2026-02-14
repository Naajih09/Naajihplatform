import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // GET /api/notifications/:userId
  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.notificationsService.findAll(userId);
  }

  // PATCH /api/notifications/:id/read
  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.notificationsService.markRead(id);
  }
}