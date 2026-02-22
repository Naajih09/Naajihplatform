import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AcademyService {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1. GET ALL COURSES (With progress count)
  async findAll() {
    return this.databaseService.course.findMany({
      include: { 
        lessons: { select: { id: true } } // Just count lessons
      }
    });
  }

  // 2. GET ONE COURSE (With Lessons)
  async findOne(id: string, userId: string) {
    const course = await this.databaseService.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          include: {
            progress: { where: { userId } } // Check if User completed this lesson
          }
        }
      }
    });
    return course;
  }

  // 3. MARK LESSON COMPLETE
  async completeLesson(userId: string, lessonId: string) {
    return this.databaseService.userProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { isCompleted: true },
      create: { userId, lessonId, isCompleted: true }
    });
  }

  // 4. SEED DUMMY DATA (For Testing)
  async seed() {
    // Create a Free Course
    const course = await this.databaseService.course.create({
      data: {
        title: "Halal Business 101",
        description: "The fundamentals of starting a Sharia-compliant business in Nigeria.",
        isPremium: false,
        thumbnail: "https://res.cloudinary.com/dktv7ospa/image/upload/v1/sample", // Placeholder
        lessons: {
          create: [
            { title: "Welcome & Introduction", order: 1, content: "Welcome to the course...", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
            { title: "Understanding Riba (Interest)", order: 2, content: "Riba is forbidden...", videoUrl: "" },
            { title: "Structuring a Mudarabah Deal", order: 3, content: "How to share profits...", videoUrl: "" }
          ]
        }
      }
    });
    return course;
  }
}