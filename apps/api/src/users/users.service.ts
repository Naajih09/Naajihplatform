import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { DatabaseService } from '../database/database.service';

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

  // 1. SIGNUP
  async create(createUserDto: CreateUserDto) {
    const { email, password, role, firstName, lastName } = createUserDto;

    let profileData = {};
    if (role === UserRole.ENTREPRENEUR) {
      profileData = { entrepreneurProfile: { create: { firstName, lastName } } };
    } else if (role === UserRole.INVESTOR) {
      profileData = { investorProfile: { create: { firstName, lastName } } };
    } else {
      profileData = { entrepreneurProfile: { create: { firstName, lastName } } };
    }

    return this.databaseService.user.create({
      data: { email, password, role, ...profileData },
    });
  }

  // 2. LOGIN
  async login(email: string, password: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { email },
        include: { entrepreneurProfile: true, investorProfile: true },
      });

      if (!user) return null;
      if (user.password !== password) return null;

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
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

  // 5. UPDATE PROFILE
  async update(id: string, data: any) {
    const { entrepreneurProfile, investorProfile, ...userData } = data;
    const updateData: any = { ...userData };

    if (entrepreneurProfile) {
      const { id: _id, userId: _uid, ...cleanData } = entrepreneurProfile;
      updateData.entrepreneurProfile = {
        upsert: { create: cleanData, update: cleanData },
      };
    }

    if (investorProfile) {
      const { id: _id, userId: _uid, ...cleanData } = investorProfile;
      if (cleanData.minTicketSize) cleanData.minTicketSize = Number(cleanData.minTicketSize);
      if (cleanData.maxTicketSize) cleanData.maxTicketSize = Number(cleanData.maxTicketSize);

      updateData.investorProfile = {
        upsert: { create: cleanData, update: cleanData },
      };
    }

    return this.databaseService.user.update({
      where: { id },
      data: updateData,
      include: { entrepreneurProfile: true, investorProfile: true },
    });
  }

  // 6. DASHBOARD STATS
  async getDashboardStats(userId: string) {
    const pitchCount = await this.databaseService.pitch.count({
      where: { userId: userId }
    });

    const connectionCount = await this.databaseService.connection.count({
      where: { 
        receiverId: userId,
        status: 'PENDING'
      }
    });

    const user = await this.databaseService.user.findUnique({
      where: { id: userId },
      select: { isVerified: true } 
    });

    return {
      activePitches: pitchCount,
      pendingConnections: connectionCount,
      isVerified: user?.isVerified || false,
      totalViews: 0 
    };
  }

  // 7. CHANGE PASSWORD (New)
  async changePassword(id: string, newPassword: string) {
    return this.databaseService.user.update({
      where: { id },
      data: { password: newPassword },
    });
  }

  // 8. DELETE ACCOUNT (New)
  async deleteUser(id: string) {
    try {
      return await this.databaseService.user.delete({ where: { id } });
    } catch (error) {
      throw new Error("Could not delete user. Check active connections.");
    }
  }

} // <--- CLASS ENDS HERE