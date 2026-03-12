import { PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from './create-message.dto';
import { IsEnum } from 'class-validator';

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  AUDIO = 'AUDIO',
  PDF = 'PDF'
}

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
