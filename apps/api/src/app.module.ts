import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module'; // <--- Import this
import { PitchesModule } from './pitches/pitches.module';
import { ConnectionsModule } from './connections/connections.module';

@Module({
  imports: [UsersModule, PitchesModule, ConnectionsModule], // <--- Add this here!
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}