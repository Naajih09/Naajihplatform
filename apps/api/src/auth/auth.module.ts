import { Module, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy'; // <--- Ensure this file exists!

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production.');
  }
  return 'DEV_ONLY_NAAJIH_JWT_SECRET';
};

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // <--- Explicitly set default
    JwtModule.register({
      global: true,
      secret: getJwtSecret(),
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy], // <--- Critical: Strategy must be here
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
