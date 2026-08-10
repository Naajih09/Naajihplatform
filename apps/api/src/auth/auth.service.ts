import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : '';

    // 1. Find the user
    const user = normalizedEmail
      ? await this.usersService.findOne(normalizedEmail)
      : null;

    // 2. Validate User & Password
    if (!user || user.isActive === false) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (!(await bcrypt.compare(pass, user.password).catch(() => false))) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    if (
      process.env.REQUIRE_EMAIL_VERIFICATION === 'true' &&
      !user.emailVerified
    ) {
      throw new UnauthorizedException('Email not verified');
    }

    // 3. Create the Token Payload
    const payload = { sub: user.id, email: user.email, role: user.role };

    // 4. SANITIZE: Remove password from the object we send back
    const {
      password: _password,
      emailVerificationToken: _emailVerificationToken,
      emailVerificationExpires: _emailVerificationExpires,
      passwordResetToken: _passwordResetToken,
      passwordResetExpires: _passwordResetExpires,
      ...safeUser
    } = user;

    // 5. Return Safe Data + Token
    return {
      user: safeUser, // No password here!
      access_token: this.jwtService.sign(payload),
    };
  }
}
