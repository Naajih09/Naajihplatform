import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

// Standard DTOs embedded for convenience
export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  PDF = 'PDF'
}

export class CreateMessageDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

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
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // POST /api/messages -> Send a text
  @Post()
  create(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body);
  }

  // GET /api/messages/conversation/:myId/:otherId
  @Get('conversation/:myId/:otherId')
  getConversation(@Param('myId') myId: string, @Param('otherId') otherId: string) {
    return this.messagesService.getConversation(myId, otherId);
  }

  // GET /api/messages/partners/:myId -> List of friends to chat with
  @Get('partners/:myId')
  getPartners(@Param('myId') myId: string) {
    return this.messagesService.getMyChatPartners(myId);
  }

  // PATCH /api/messages/:messageId/read -> Mark as read
  @Patch(':messageId/read')
  markAsRead(
    @Param('messageId') messageId: string, 
    @Body('userId') userId: string // Ideally replace with @Request() req.user.id when JwtAuthGuard is added globally
  ) {
    return this.messagesService.markAsRead(messageId, userId);
  }

  // DELETE /api/messages/:messageId -> Unsend/Delete message
  @Delete(':messageId')
  deleteMessage(
    @Param('messageId') messageId: string, 
    @Query('userId') userId: string // Passed as query param: ?userId=xxx
  ) {
    return this.messagesService.deleteMessage(messageId, userId);
  }
}