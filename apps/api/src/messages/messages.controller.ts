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
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
