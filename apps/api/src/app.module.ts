import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConnectionsModule } from './connections/connections.module';
import { DatabaseModule } from './database/database.module';
import { PitchesModule } from './pitches/pitches.module';
import { UsersModule } from './users/users.module'; // <--- Import this

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env',
    }),
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // not more than 4 request in 1sec
        limit: 4,
      },
      {
        name: 'long',
        ttl: 60000, // not more than 100 request in 1min
        limit: 100,
      },
    ]),
    UsersModule,
    PitchesModule,
    ConnectionsModule,
  ], // <--- Add this here!
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerModule,
    },
  ],
})
export class AppModule {}
