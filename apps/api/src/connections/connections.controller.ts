import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ConnectionsService } from './connections.service';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  // POST /connections (Send Request)
  @Post()
  create(@Body() body: any) {
    // Body: { senderId, receiverId }
    return this.connectionsService.create(body.senderId, body.receiverId);
  }

  // GET /connections/user/:userId (View My Network)
  @Get('user/:userId')
  findAll(@Param('userId') userId: string) {
    return this.connectionsService.findAll(userId);
  }
}