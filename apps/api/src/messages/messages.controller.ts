import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // POST /api/messages -> Send a text
  @Post()
  create(@Body() body: any) {
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
}