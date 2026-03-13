import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { IsString, IsNotEmpty } from 'class-validator';

// Standard DTO embedded
export class CreateConnectionDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;
}

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  // POST /api/connections -> Send Request
  @Post()
  create(@Body() body: CreateConnectionDto) {
    return this.connectionsService.create(body);
  }

  // GET /api/connections/user/:userId -> Get My Friends
  @Get('user/:userId')
  findAll(@Param('userId') userId: string) {
    return this.connectionsService.getMyConnections(userId);
  }

  // GET /api/connections/pending/:userId -> Get Incoming Requests
  @Get('pending/:userId')
  findPending(@Param('userId') userId: string) {
    return this.connectionsService.getPendingRequests(userId);
  }

  // PATCH /api/connections/:id -> Accept/Reject
  @Patch(':id')
  respond(@Param('id') id: string, @Body('status') status: 'ACCEPTED' | 'REJECTED') {
    return this.connectionsService.respond(id, status);
  }

  // DELETE /api/connections/:id -> Cancel/Remove Connection
  @Delete(':id')
  removeConnection(
    @Param('id') id: string,
    @Query('userId') userId: string // Expected via ?userId=...
  ) {
    return this.connectionsService.removeConnection(id, userId);
  }
}