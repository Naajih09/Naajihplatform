import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AcademyModule } from './academy/academy.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConnectionsModule } from './connections/connections.module';
import { DatabaseModule } from './database/database.module';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PitchesModule } from './pitches/pitches.module';
import { UsersModule } from './users/users.module';
import { VerificationModule } from './verification/verification.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    CloudinaryModule,
    MessagesModule,
    VerificationModule,
    NotificationsModule,
    AuthModule,
    AcademyModule,
  ], 
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerModule,
    },
  ],
})
export class AppModule {}
