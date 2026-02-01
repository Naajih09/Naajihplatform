import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { DatabaseModule } from '../database/database.module'; // <--- Import this

@Module({
  imports: [DatabaseModule], // <--- Add this line!
  controllers: [ConnectionsController],
  providers: [ConnectionsService],
})
export class ConnectionsModule {}