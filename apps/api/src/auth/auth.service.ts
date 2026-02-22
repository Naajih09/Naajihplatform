import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string) {
    // 1. Find the user
    const user = await this.usersService.findOne(email);

    // 2. Validate User & Password
    // Note: If you have plain text passwords in DB right now, temporary use:
    // if (!user || user.password !== pass) {
    
    // Ideally, use bcrypt:
    if (!user || !(await bcrypt.compare(pass, user.password).catch(() => false)) && user.password !== pass) {
        throw new UnauthorizedException("Invalid Credentials");
    }

    // 3. Create the Token Payload
    const payload = { sub: user.id, email: user.email, role: user.role };

    // 4. SANITIZE: Remove password from the object we send back
    const { password, ...safeUser } = user;

    // 5. Return Safe Data + Token
    return {
      user: safeUser, // No password here!
      access_token: this.jwtService.sign(payload),
    };
  }
}