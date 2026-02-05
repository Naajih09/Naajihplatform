import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DatabaseModule } from '../database/database.module'; // <-- IMPORT DATABASE MODULE

@Module({
  imports: [DatabaseModule], // <-- this allows DI to resolve DatabaseService
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
