import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

interface CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1. SIGNUP logic (Create User + Profile)
  async create(createUserDto: CreateUserDto) {
    const { email, password, role, firstName, lastName } = createUserDto;

    // Determine profile type based on role
    let profileData = {};
    if (role === UserRole.ENTREPRENEUR) {
      profileData = {
        entrepreneurProfile: { create: { firstName, lastName } },
      };
    } else if (role === UserRole.INVESTOR) {
      profileData = { investorProfile: { create: { firstName, lastName } } };
    } else {
      // Default for Aspirant
      profileData = {
        entrepreneurProfile: { create: { firstName, lastName } },
      };
    }

    return this.databaseService.user.create({
      data: { email, password, role, ...profileData },
    });
  }

  // 2. LOGIN logic (Check Password)
  async login(email: string, password: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
      include: { entrepreneurProfile: true, investorProfile: true },
    });

    if (!user) return null;
    if (user.password !== password) return null;

    return user;
  }

  // 3. FIND ALL
  async findAll() {
    return this.databaseService.user.findMany({
      include: { entrepreneurProfile: true, investorProfile: true },
    });
  }

  // 4. FIND ONE
  async findOne(email: string) {
    return this.databaseService.user.findUnique({
      where: { email },
      include: { entrepreneurProfile: true, investorProfile: true },
    });
  }

  // 5. UPDATE PROFILE (The Safer Upsert Version)
  async update(id: string, data: any) {
    const { entrepreneurProfile, investorProfile, ...userData } = data;

    const updateData: any = { ...userData };

    // Handle Entrepreneur Profile
    if (entrepreneurProfile) {
      updateData.entrepreneurProfile = {
        upsert: {
          create: entrepreneurProfile,
          update: entrepreneurProfile,
        },
      };
    }

    // Handle Investor Profile
    if (investorProfile) {
      if (investorProfile.minTicketSize)
        investorProfile.minTicketSize = Number(investorProfile.minTicketSize);
      if (investorProfile.maxTicketSize)
        investorProfile.maxTicketSize = Number(investorProfile.maxTicketSize);

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
      include: { entrepreneurProfile: true, investorProfile: true },
    });
  }
}
