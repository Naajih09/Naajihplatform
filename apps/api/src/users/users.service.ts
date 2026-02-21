import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // Remove IDs to avoid Prisma errors
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, userId: _uid, ...cleanData } = entrepreneurProfile;
      updateData.entrepreneurProfile = {
        upsert: { create: cleanData, update: cleanData },
      };
    }

    if (investorProfile) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // 8. DELETE ACCOUNT (The Nuclear Option - Fixed)
  async deleteUser(id: string) {
    // 1. Delete related connections
    await this.databaseService.connection.deleteMany({
        where: { OR: [{ senderId: id }, { receiverId: id }] }
    });

    // 2. Delete related messages (New addition for safety)
    await this.databaseService.message.deleteMany({
        where: { OR: [{ senderId: id }, { receiverId: id }] }
    });

    // 3. Delete their pitches
    await this.databaseService.pitch.deleteMany({
        where: { userId: id }
    });

    // 4. Delete their profile (Entrepreneur/Investor)
    try {
        await this.databaseService.entrepreneurProfile.delete({ where: { userId: id } });
    } catch(e) {} 

    try {
        await this.databaseService.investorProfile.delete({ where: { userId: id } });
    } catch(e) {} 

    // 5. Finally, Delete the User
    return this.databaseService.user.delete({ where: { id } });
  }

  // 9. UPGRADE TO PREMIUM
  async upgradeToPremium(userId: string) {
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