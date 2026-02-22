import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // <--- Ensure this file exists!

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // <--- Explicitly set default
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'DO_NOT_SHARE_THIS_SECRET_KEY_NAAJIH_2026',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy], // <--- Critical: Strategy must be here
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}