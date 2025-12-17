import { Module } from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { ConnectionsController } from './connections.controller';
import { PrismaService } from 'src/prisma.service';


@Module({
  controllers: [ConnectionsController],
  providers: [ConnectionsService, PrismaService],
})
export class ConnectionsModule {}
