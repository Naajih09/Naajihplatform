import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs'; // Fixed import

// Interface for type safety
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

  // 1. SIGNUP (Create User + Profile + Hash Password)
  async create(createUserDto: CreateUserDto) {
    const { email, password, role, firstName, lastName } = createUserDto;
    
    // 🔐 HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine profile type based on role
    let profileData = {};
    if (role === UserRole.ENTREPRENEUR) {
      profileData = { entrepreneurProfile: { create: { firstName, lastName } } };
    } else if (role === UserRole.INVESTOR) {
      profileData = { investorProfile: { create: { firstName, lastName } } };
    } else {
      // Default for Aspirant
      profileData = { entrepreneurProfile: { create: { firstName, lastName } } };
    }

    // Save to Database
    const newUser = await this.databaseService.user.create({
      data: { 
        email, 
        password: hashedPassword, // Save the HASH
        role, 
        ...profileData 
      },
      include: { entrepreneurProfile: true, investorProfile: true }
    });

    // Remove password before returning
    const { password: _, ...result } = newUser;
    return result;
  }

  // 2. LOGIN (Check Hashed Password)
  async login(email: string, pass: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email },
      include: { entrepreneurProfile: true, investorProfile: true },
    });

    if (!user) return null;

    // Compare the plain text 'pass' with the Hash in DB
    const isMatch = await bcrypt.compare(pass, user.password);
    
    if (!isMatch) return null;

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

  // 7. CHANGE PASSWORD
  async changePassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.databaseService.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  // 8. DELETE ACCOUNT
  async deleteUser(id: string) {
    try {
      return await this.databaseService.user.delete({ where: { id } });
    } catch (error) {
      throw new Error("Could not delete user. Check active connections.");
    }
  }

  // 9. UPGRADE TO PREMIUM (Used by Paystack)
  async upgradeToPremium(userId: string) {
    // Check if subscription exists
    const sub = await this.databaseService.subscription.findUnique({ where: { userId } });

    if (sub) {
      return this.databaseService.subscription.update({
        where: { userId },
        data: { plan: 'PREMIUM' }
      });
    } else {
      return this.databaseService.subscription.create({
        data: {
          userId,
          plan: 'PREMIUM'
        }
      });
    }
  }
}