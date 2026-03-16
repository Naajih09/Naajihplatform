import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, ConnectionStatus } from '@prisma/client';

// DTO for creating connections
// Consider moving this to `apps/api/src/connections/dto/create-connection.dto.ts`
export class CreateConnectionDto {
  // @IsString() @IsNotEmpty() senderId: string; // senderId should come from authenticated user
  @IsString()
  @IsNotEmpty()
  receiverId: string;
}

// DTO for responding to connections
// Consider moving this to `apps/api/src/connections/dto/respond-connection.dto.ts`
export class RespondConnectionDto {
  @IsEnum(ConnectionStatus)
  status: 'ACCEPTED' | 'REJECTED'; // Only these two values
}

@UseGuards(JwtAuthGuard, RolesGuard) // Protect the entire controller
@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  // POST /api/connections -> Send Request
  // Allowed for Entrepreneur, Investor, and Aspiring Business Owner
  @Post()
  @Roles(
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  async create(
    @Body() createConnectionDto: CreateConnectionDto,
    @Request() req,
  ) {
    // The senderId should always be the authenticated user's ID
    const senderId = req.user.id;
    if (senderId === createConnectionDto.receiverId) {
      throw new ForbiddenException(
        'Cannot send a connection request to yourself.',
      );
    }
    return this.connectionsService.create({
      senderId,
      receiverId: createConnectionDto.receiverId,
    });
  }

  // GET /api/connections/user/:userId -> Get My Connections (Accepted)
  // User can get their own connections, Admin can get anyone's
  @Get('user/:userId')
  @Roles(
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ADMIN,
  )
  async findAll(@Param('userId') userId: string, @Request() req) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException('You can only view your own connections.');
    }
    return this.connectionsService.getMyConnections(userId);
  }

  // GET /api/connections/pending/:userId -> Get Incoming Requests
  // User can get their own pending requests, Admin can get anyone's
  @Get('pending/:userId')
  @Roles(
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ADMIN,
  )
  async findPending(@Param('userId') userId: string, @Request() req) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException(
        'You can only view your own pending requests.',
      );
    }
    return this.connectionsService.getPendingRequests(userId);
  }

  // PATCH /api/connections/:id -> Accept/Reject a specific connection request
  // Only the receiver of the connection request should be able to respond
  @Patch(':id')
  @Roles(
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
  )
  async respond(
    @Param('id') id: string, // Connection ID
    @Body() respondConnectionDto: RespondConnectionDto, // Use DTO
    @Request() req,
  ) {
    // Before responding, you might want to verify that the authenticated user is the receiver of this connection request.
    // This would involve fetching the connection by 'id' and checking its 'receiverId'.
    const connection = await this.connectionsService.findOne(id); // Assume findOne method exists in service
    if (!connection || connection.receiverId !== req.user.id) {
      throw new ForbiddenException(
        'You are not authorized to respond to this connection request.',
      );
    }
    return this.connectionsService.respond(id, respondConnectionDto.status);
  }

  // DELETE /api/connections/:id -> Cancel/Remove Connection
  // User can remove their own connection (either as sender or receiver)
  // Admin can remove any connection
  @Delete(':id')
  @Roles(
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ADMIN,
  )
  async removeConnection(
    @Param('id') id: string, // Connection ID
    @Query('userId') userId: string, // Expected via ?userId=... (the user initiating the removal)
    @Request() req,
  ) {
    // Ensure the userId in the query parameter matches the authenticated user's ID, unless it's an ADMIN
    if (req.user.role !== UserRole.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException(
        'You can only remove connections for your own account.',
      );
    }
    // Further check: ensure the authenticated user (or admin) is involved in this connection
    const connection = await this.connectionsService.findOne(id); // Assume findOne method exists
    if (
      !connection ||
      (req.user.role !== UserRole.ADMIN &&
        connection.senderId !== userId &&
        connection.receiverId !== userId)
    ) {
      throw new ForbiddenException(
        'You are not authorized to remove this connection.',
      );
    }

    return this.connectionsService.removeConnection(id, userId);
  }
}
