import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PitchesService {
  constructor(private prisma: PrismaService) {}

  // 1. CREATE A PITCH
  async create(data: Prisma.PitchCreateInput) {
    return this.prisma.pitch.create({
      data,
    });
  }

  // 2. GET ALL PITCHES (For the Feed)
  async findAll() {
    return this.prisma.pitch.findMany({
      include: { 
        user: { // Include the owner's name
          include: { entrepreneurProfile: true } 
        } 
      },
      orderBy: { createdAt: 'desc' } // Newest first
    });
  }

  // 3. GET ONE PITCH (For Details View)
  async findOne(id: string) {
    return this.prisma.pitch.findUnique({
      where: { id },
      include: { user: true }
    });
  }
}