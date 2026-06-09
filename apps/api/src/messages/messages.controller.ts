import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

// Standard DTOs embedded for convenience
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  PDF = 'PDF',
}

export class CreateMessageDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;
}

export class ReportMessageDto {
  @IsString()
  @IsNotEmpty()
  reportedUserId: string;

  @IsString()
  @IsOptional()
  messageId?: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // POST /api/messages -> Send a text
  @Post()
  create(@Body() body: CreateMessageDto, @Request() req) {
    return this.messagesService.create({
      ...body,
      senderId: req.user.id,
    });
  }

  // GET /api/messages/conversation/:otherId
  @Get('conversation/:otherId')
  getConversation(@Param('otherId') otherId: string, @Request() req) {
    return this.messagesService.getConversation(req.user.id, otherId);
  }

  // GET /api/messages/partners -> List of friends to chat with
  @Get('partners')
  getPartners(@Request() req) {
    return this.messagesService.getMyChatPartners(req.user.id);
  }

  // GET /api/messages/unread-count -> Count unread messages for sidebar badge
  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadCount(req.user.id);
  }

  @Post('report')
  reportConversation(@Body() body: ReportMessageDto, @Request() req) {
    return this.messagesService.reportConversation({
      reporterId: req.user.id,
      reportedUserId: body.reportedUserId,
      messageId: body.messageId,
      reason: body.reason,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/reports')
  getAdminReports(@Query('status') status?: string) {
    return this.messagesService.getAdminReports(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/reports/:reportId/conversation')
  getAdminConversation(@Param('reportId') reportId: string) {
    return this.messagesService.getAdminConversation(reportId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/reports/:reportId/resolve')
  resolveReport(@Param('reportId') reportId: string) {
    return this.messagesService.resolveReport(reportId);
  }

  // PATCH /api/messages/conversation/:otherId/read -> Mark a conversation as read
  @Patch('conversation/:otherId/read')
  markConversationAsRead(@Param('otherId') otherId: string, @Request() req) {
    return this.messagesService.markConversationAsRead(req.user.id, otherId);
  }

  // PATCH /api/messages/:messageId/read -> Mark as read
  @Patch(':messageId/read')
  markAsRead(@Param('messageId') messageId: string, @Request() req) {
    return this.messagesService.markAsRead(messageId, req.user.id);
  }

  // DELETE /api/messages/:messageId -> Unsend/Delete message
  @Delete(':messageId')
  deleteMessage(@Param('messageId') messageId: string, @Request() req) {
    return this.messagesService.deleteMessage(messageId, req.user.id);
  }
}
