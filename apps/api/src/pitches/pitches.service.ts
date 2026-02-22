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

  // 2. GET ALL PITCHES (With Search & Filter)
  async findAll(query: { search?: string; category?: string }) {
    const { search, category } = query;

    return this.prisma.pitch.findMany({
      where: {
        AND: [
          // Filter by Category if provided
          category && category !== 'All' ? { category: category } : {},
          
          // Search by Title or Tagline if provided
          search ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { tagline: { contains: search, mode: 'insensitive' } },
            ]
          } : {}
        ]
      },
      include: { 
        user: { 
          include: { entrepreneurProfile: true } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  // 3. GET ONE PITCH (For Details View)
  async findOne(id: string) {
    return this.prisma.pitch.findUnique({
      where: { id },
      include: { user: true }
    });
  }

  // 4. UPDATE PITCH
  async update(id: string, data: any) {
    return this.prisma.pitch.update({
      where: { id },
      data,
    });
  }

  // 5. DELETE PITCH
  async remove(id: string) {
    return this.prisma.pitch.delete({
      where: { id },
    });
  }
}
