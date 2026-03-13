// apps/api/src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { User, UserRole } from '@prisma/client'; // <-- FIXED: Changed 'Role' to 'UserRole'

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
      secretOrKey: process.env.JWT_SECRET || 'DO_NOT_SHARE_THIS_SECRET_KEY_NAAJIH_2026',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    // FIX: Using a common UsersService method to find a user by ID.
    // ASSUMPTION: Your UsersService has a method like `findById` or `findOne` that takes the ID string directly.
    // You might need to adjust `this.usersService.findById(payload.sub)` to your actual method name.
    const user = await this.usersService.findById(payload.sub); // <-- CHANGED: Assumed `findById` method

    if (!user) {
      throw new UnauthorizedException('User not found or invalid token.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    } as User;
  }
}