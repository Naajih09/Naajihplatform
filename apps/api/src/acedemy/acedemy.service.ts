import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AcademyService {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1. GET ALL PROGRAMS (With progress count)
  async findAll() {
    return this.databaseService.program.findMany({
      include: { 
        modules: {
          include: {
            lessons: { select: { id: true } } // Just count lessons
          }
        }
      }
    });
  }

  // 2. GET ONE PROGRAM (With Lessons)
  async findOne(id: string, userId: string) {
    const program = await this.databaseService.program.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                progress: { where: { userId } } // Check if User completed this lesson
              }
            }
          }
        }
      }
    });
    return program;
  }

  // 3. MARK LESSON COMPLETE
  async completeLesson(userId: string, lessonId: string) {
    return this.databaseService.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { isCompleted: true },
      create: { userId, lessonId, isCompleted: true }
    });
  }

  // 4. SEED DUMMY DATA (For Testing)
  async seed() {
    // Create a Program
    const program = await this.databaseService.program.create({
      data: {
        title: "Halal Business 101",
        cohort: "Cohort 1",
        description: "The fundamentals of starting a Sharia-compliant business in Nigeria.",
        modules: {
          create: [
            {
              title: "Week 1",
              order: 1,
              lessons: {
                create: [
                  { title: "Welcome & Introduction", order: 1, contentType: "VIDEO", duration: 10, content: "Welcome to the course...", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
                  { title: "Understanding Riba (Interest)", order: 2, contentType: "VIDEO", duration: 10, content: "Riba is forbidden...", videoUrl: "" },
                  { title: "Structuring a Mudarabah Deal", order: 3, contentType: "VIDEO", duration: 10, content: "How to share profits...", videoUrl: "" }
                ]
              }
            }
          ]
        }
      }
    });
    return program;
  }
}