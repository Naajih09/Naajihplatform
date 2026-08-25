// apps/api/src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { User, UserRole } from '@prisma/client'; // <-- FIXED: Changed 'Role' to 'UserRole'

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be set in production.');
  }
  return 'DEV_ONLY_NAAJIH_JWT_SECRET';
};

// Define the shape of your JWT payload
export interface JwtPayload {
  sub: string; // Typically the user ID
  email: string;
  role: UserRole; // Using UserRole
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getJwtSecret(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found or invalid token.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      adminPermissions: user.adminPermissions,
      isConferenceWaitlist: Boolean(user.isConferenceWaitlist),
      conferenceNotifiedAt: user.conferenceNotifiedAt ?? null,
    } as User;
  }
}
