import { Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1. SIGNUP (Create User + Profile)
  async create(createUserDto: CreateUserDto) {
    const { email, password, role, firstName, lastName } = createUserDto;

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Role-based profile creation
    let profileData = {};

    if (role === UserRole.ENTREPRENEUR) {
      profileData = {
        entrepreneurProfile: {
          create: { firstName, lastName },
        },
      };
    } else if (role === UserRole.INVESTOR) {
      profileData = {
        investorProfile: {
          create: { firstName, lastName },
        },
      };
    } else {
      // ASPIRING_BUSINESS_OWNER (default behavior)
      profileData = {
        entrepreneurProfile: {
          create: { firstName, lastName },
        },
      };
    }

    return this.databaseService.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        ...profileData,
      },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
      },
    });
  }

  // 2. LOGIN (Password verification)
  async login(email: string, password: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
      },
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  // 3. FIND ALL USERS
  async findAll() {
    return this.databaseService.user.findMany({
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
      },
    });
  }

  // 4. FIND ONE USER
  async findOne(email: string) {
    return this.databaseService.user.findUnique({
      where: { email },
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
      },
    });
  }

  // 5. UPDATE USER + PROFILE (Safe Upsert)
  async update(id: string, updateUserDto: UpdateUserDto) {
    const { entrepreneurProfile, investorProfile, ...userData } = updateUserDto;

    const updateData: any = { ...userData };

    if (entrepreneurProfile) {
      updateData.entrepreneurProfile = {
        upsert: {
          create: entrepreneurProfile,
          update: entrepreneurProfile,
        },
      };
    }

    if (investorProfile) {
      updateData.investorProfile = {
        upsert: {
          create: investorProfile,
          update: investorProfile,
        },
      };
    }

    return this.databaseService.user.update({
      where: { id },
      data: updateData,
      include: {
        entrepreneurProfile: true,
        investorProfile: true,
      },
    });
  }
}
