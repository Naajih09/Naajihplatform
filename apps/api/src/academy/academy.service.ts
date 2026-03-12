import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AcademyService {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1️⃣ GET ALL PROGRAMS (With optional progress count)
  async findAll(userId?: string) {
    return this.databaseService.program.findMany({
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                progress: userId ? { where: { userId } } : false,
              },
            },
          },
        },
      },
    });
  }

  // 2️⃣ GET ONE PROGRAM (With lessons + progress)
  async findOne(programId: string, userId: string) {
    return this.databaseService.program.findUnique({
      where: { id: programId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                progress: { where: { userId } },
              },
            },
          },
        },
      },
    });
  }

  // 3️⃣ GET ONE LESSON
  async getLesson(id: string) {
    return this.databaseService.lesson.findUnique({
      where: { id },
    });
  }

  // 4️⃣ MARK LESSON COMPLETE
  async completeLesson(userId: string, lessonId: string) {
    return this.databaseService.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { isCompleted: true },
      create: { userId, lessonId, isCompleted: true },
    });
  }

  // 5️⃣ JOIN PROGRAM (ProgramEnrollment)
  async joinProgram(userId: string, programId: string) {
    return this.databaseService.programEnrollment.upsert({
      where: { userId_programId: { userId, programId } },
      update: {},
      create: { userId, programId },
    });
  }

  // 6️⃣ SEED PROGRAMS + MODULES + LESSONS
  async seed() {
    const programsData =[
      {
        title: "1. Build a Profitable Business in 30 Days",
        description: "The Flagship Program. Go from zero to your first customer in one month. No theory, just execution.",
        cohort: "Cohort 1 (Feb 2026)",
        modules:[
          {
            title: "Week 1: Finding a Pain-Killer Idea",
            order: 1,
            unlockDate: new Date(),
            lessons:[
              {
                title: "The Pain-Killer Framework",
                order: 1,
                videoUrl: "", // ✅ FIXED: Replaced ", with ""
                content: "<h3>The Pain-Killer Framework</h3><p>Don't build vitamins. Build Pain-Killers. Go to the market and find 10 people screaming for a solution.</p><strong>Task:</strong> Interview 5 potential customers today.",
                contentType: "video",
                duration: 600,
              },
              {
                title: "Interview Customers",
                order: 2,
                videoUrl: "", // ✅ FIXED
                content: "Task: Interview 5 potential customers today.",
                contentType: "video",
                duration: 300,
              },
            ],
          },
          {
            title: "Week 2: The MVP (Minimum Viable Product)",
            order: 2,
            unlockDate: new Date(),
            lessons:[
              {
                title: "Build it Ugly",
                order: 1,
                videoUrl: "", // ✅ FIXED
                content: "<h3>Build it Ugly</h3><p>If you aren't embarrassed by your first version, you launched too late. Do not code yet. Use WhatsApp, Excel, or paper.</p>",
                contentType: "video",
                duration: 600,
              },
            ],
          },
        ],
      },
    ];

    let createdCount = 0;

    for (const programData of programsData) {
      const existingProgram = await this.databaseService.program.findFirst({
        where: { title: programData.title },
      });

      if (!existingProgram) {
        await this.databaseService.program.create({
          data: {
            title: programData.title,
            description: programData.description,
            cohort: programData.cohort,
            modules: {
              create: programData.modules.map((mod) => ({
                title: mod.title,
                order: mod.order,
                unlockDate: mod.unlockDate,
                lessons: {
                  create: mod.lessons.map((lesson) => ({
                    title: lesson.title,
                    order: lesson.order,
                    videoUrl: lesson.videoUrl,
                    content: lesson.content,
                    contentType: lesson.contentType,
                    duration: lesson.duration,
                  })),
                },
              })),
            },
          },
        });
        createdCount++;
      }
    }

    return { message: `${createdCount} programs created successfully!` };
  }
}