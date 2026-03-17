import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class AcademyService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
    private readonly mailerService: MailerService,
  ) {}

  // 1️⃣ GET ALL PROGRAMS (With optional progress count)
  async findAll(userId?: string) {
    const programs = await this.databaseService.program.findMany({
      include: {
        enrollments: userId
          ? {
              where: { userId },
              select: { id: true, enrolledAt: true, status: true },
            }
          : false,
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
    return this.addProgramComputedFields(programs);
  }

  // 2️⃣ GET ONE PROGRAM (With lessons + progress)
  async findOne(programId: string, userId: string) {
    const program = await this.databaseService.program.findUnique({
      where: { id: programId },
      include: {
        enrollments: {
          where: { userId },
          select: { id: true, enrolledAt: true, status: true },
        },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                progress: { where: { userId } },
              },
            },
            tasks: {
              orderBy: { dueDate: 'asc' },
              include: {
                submissions: {
                  where: { userId },
                  orderBy: { submittedAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
    return program ? (this.addProgramComputedFields([program])[0] ?? program) : program;
  }

  // 3️⃣ GET ONE LESSON
  async getLesson(id: string, userId?: string) {
    const lesson = await this.databaseService.lesson.findUnique({
      where: { id },
      include: {
        module: {
          select: {
            programId: true,
            unlockDate: true,
          },
        },
      },
    });

    if (!lesson) return null;

    const isUnlocked =
      !lesson.module?.unlockDate || new Date(lesson.module.unlockDate) <= new Date();

    let isEnrolled = true;
    if (userId && lesson.module?.programId) {
      const enrollment = await this.databaseService.programEnrollment.findFirst({
        where: {
          userId,
          programId: lesson.module.programId,
          status: 'APPROVED',
        },
      });
      isEnrolled = Boolean(enrollment);
    }

    if (!isUnlocked || !isEnrolled) {
      return {
        ...lesson,
        videoUrl: null,
        content: null,
      };
    }

    return lesson;
  }

  // 4️⃣ MARK LESSON COMPLETE
  async completeLesson(userId: string, lessonId: string) {
    const progress = await this.databaseService.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { isCompleted: true },
      create: { userId, lessonId, isCompleted: true },
    });
    const milestone = await this.awardProgramCompletionMilestone(userId, lessonId);
    return { progress, milestone };
  }

  // 5️⃣ JOIN PROGRAM (ProgramEnrollment)
  async joinProgram(userId: string, programId: string) {
    const program = await this.databaseService.program.findUnique({
      where: { id: programId },
      select: { id: true, isPremium: true },
    });

    if (!program) {
      throw new ForbiddenException('Program not found.');
    }

    if (program.isPremium) {
      const subscription = await this.databaseService.subscription.findUnique({
        where: { userId },
      });
      const activeUntil = subscription?.endDate || subscription?.trialEndsAt;
      const hasAccess =
        subscription?.plan === 'PREMIUM' &&
        (!activeUntil || activeUntil > new Date());
      if (!hasAccess) {
        throw new ForbiddenException('Premium subscription required.');
      }
    }

    const existing = await this.databaseService.programEnrollment.findUnique({
      where: { userId_programId: { userId, programId } },
    });

    if (existing) {
      if (existing.status === 'APPROVED') {
        return existing;
      }
      return this.databaseService.programEnrollment.update({
        where: { id: existing.id },
        data: {
          status: 'PENDING',
          reviewedAt: null,
        },
      });
    }

    return this.databaseService.programEnrollment.create({
      data: {
        userId,
        programId,
        status: 'PENDING',
      },
    });
  }

  // 6️⃣ SUBMIT TASK (assignment upload/link)
  async submitTask(userId: string, taskId: string, submissionUrl?: string) {
    const task = await this.databaseService.task.findUnique({
      where: { id: taskId },
      select: { module: { select: { programId: true, unlockDate: true } } },
    });

    if (!task?.module?.programId) {
      throw new ForbiddenException('Task not found.');
    }

    const isUnlocked =
      !task.module.unlockDate || new Date(task.module.unlockDate) <= new Date();

    const enrollment = await this.databaseService.programEnrollment.findFirst({
      where: { userId, programId: task.module.programId, status: 'APPROVED' },
    });

    if (!isUnlocked || !enrollment) {
      throw new ForbiddenException('Program access required.');
    }

    return this.databaseService.userTaskSubmission.create({
      data: {
        userId,
        taskId,
        submissionUrl,
        status: 'SUBMITTED',
      },
    });
  }

  // 7️⃣ GET USER MILESTONES
  async getUserMilestones(userId: string) {
    return this.databaseService.userMilestone.findMany({
      where: { userId },
      orderBy: { achievedAt: 'desc' },
      include: { milestone: true },
    });
  }

  // ---------------- ADMIN ACADEMY MANAGEMENT ----------------
  async adminListPrograms() {
    return this.databaseService.program.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { modules: true } },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            _count: { select: { lessons: true, tasks: true } },
          },
        },
      },
    });
  }

  async adminGetProgram(id: string) {
    return this.databaseService.program.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: { orderBy: { order: 'asc' } },
            tasks: { orderBy: { dueDate: 'asc' } },
          },
        },
      },
    });
  }

  async adminCreateProgram(body: {
    title: string;
    description?: string;
    cohort?: string;
    isPremium?: boolean;
  }) {
    return this.databaseService.program.create({
      data: {
        title: body.title,
        description: body.description ?? '',
        cohort: body.cohort ?? '',
        isPremium: Boolean(body.isPremium),
      },
    });
  }

  async adminUpdateProgram(
    id: string,
    body: { title?: string; description?: string; cohort?: string; isPremium?: boolean },
  ) {
    return this.databaseService.program.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        cohort: body.cohort,
        isPremium: body.isPremium,
      },
    });
  }

  async adminCreateModule(
    programId: string,
    body: { title: string; order?: number; unlockDate?: string },
  ) {
    return this.databaseService.module.create({
      data: {
        programId,
        title: body.title,
        order: body.order ?? 1,
        unlockDate: body.unlockDate ? new Date(body.unlockDate) : null,
      },
    });
  }

  async adminUpdateModule(
    id: string,
    body: { title?: string; order?: number; unlockDate?: string | null },
  ) {
    return this.databaseService.module.update({
      where: { id },
      data: {
        title: body.title,
        order: body.order,
        unlockDate:
          body.unlockDate === null
            ? null
            : body.unlockDate
            ? new Date(body.unlockDate)
            : undefined,
      },
    });
  }

  async adminCreateLesson(
    moduleId: string,
    body: {
      title: string;
      order?: number;
      videoUrl?: string;
      content?: string;
      contentType?: string;
      duration?: number;
    },
  ) {
    return this.databaseService.lesson.create({
      data: {
        moduleId,
        title: body.title,
        order: body.order ?? 1,
        videoUrl: body.videoUrl ?? '',
        content: body.content ?? '',
        contentType: body.contentType ?? 'VIDEO',
        duration: body.duration ?? 300,
      },
    });
  }

  async adminUpdateLesson(
    id: string,
    body: {
      title?: string;
      order?: number;
      videoUrl?: string | null;
      content?: string | null;
      contentType?: string;
      duration?: number;
    },
  ) {
    return this.databaseService.lesson.update({
      where: { id },
      data: {
        title: body.title,
        order: body.order,
        videoUrl: body.videoUrl === null ? null : body.videoUrl,
        content: body.content === null ? null : body.content,
        contentType: body.contentType,
        duration: body.duration,
      },
    });
  }

  async adminCreateTask(
    moduleId: string,
    body: { title: string; description?: string; dueDate?: string },
  ) {
    return this.databaseService.task.create({
      data: {
        moduleId,
        title: body.title,
        description: body.description ?? '',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      },
    });
  }

  async adminUpdateTask(
    id: string,
    body: { title?: string; description?: string; dueDate?: string | null },
  ) {
    return this.databaseService.task.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        dueDate:
          body.dueDate === null
            ? null
            : body.dueDate
            ? new Date(body.dueDate)
            : undefined,
      },
    });
  }

  async adminImportLessons(moduleId: string, csvText: string) {
    const rows = this.parseCsv(csvText);
    const errors: string[] = [];
    let created = 0;
    let failed = 0;

    for (const row of rows) {
      const data = row.data;
      if (!data.title) {
        failed++;
        errors.push(`Row ${row.rowNumber}: Missing title.`);
        continue;
      }
      let contentType = (data.contentType || 'VIDEO').toUpperCase();
      if (!['VIDEO', 'ARTICLE', 'QUIZ'].includes(contentType)) {
        errors.push(`Row ${row.rowNumber}: Invalid contentType "${data.contentType}".`);
        contentType = 'VIDEO';
      }

      const duration = Number(data.duration);
      const durationValue = Number.isFinite(duration) ? duration : 300;
      if (data.duration && !Number.isFinite(duration)) {
        errors.push(`Row ${row.rowNumber}: Invalid duration "${data.duration}".`);
      }

      await this.databaseService.lesson.create({
        data: {
          moduleId,
          title: data.title,
          order: Number(data.order) || 1,
          videoUrl: data.videoUrl || '',
          content: data.content || '',
          contentType,
          duration: durationValue,
        },
      });
      created++;
    }

    return { created, failed, errors };
  }

  async adminImportTasks(moduleId: string, csvText: string) {
    const rows = this.parseCsv(csvText);
    const errors: string[] = [];
    let created = 0;
    let failed = 0;

    for (const row of rows) {
      const data = row.data;
      if (!data.title) {
        failed++;
        errors.push(`Row ${row.rowNumber}: Missing title.`);
        continue;
      }

      let dueDate: Date | null = null;
      if (data.dueDate) {
        const parsed = new Date(data.dueDate);
        if (Number.isNaN(parsed.getTime())) {
          errors.push(`Row ${row.rowNumber}: Invalid dueDate "${data.dueDate}".`);
        } else {
          dueDate = parsed;
        }
      }

      await this.databaseService.task.create({
        data: {
          moduleId,
          title: data.title,
          description: data.description || '',
          dueDate,
        },
      });
      created++;
    }

    return { created, failed, errors };
  }

  async adminImportPrograms(csvText: string) {
    const rows = this.parseCsv(csvText);
    const errors: string[] = [];
    let created = 0;
    let failed = 0;

    for (const row of rows) {
      const data = row.data;
      if (!data.title) {
        failed++;
        errors.push(`Row ${row.rowNumber}: Missing title.`);
        continue;
      }
      const isPremiumValue = String(data.isPremium || '')
        .trim()
        .toLowerCase();
      const isPremium =
        isPremiumValue === 'true' ||
        isPremiumValue === '1' ||
        isPremiumValue === 'yes';
      await this.databaseService.program.create({
        data: {
          title: data.title,
          description: data.description || '',
          cohort: data.cohort || '',
          isPremium,
        },
      });
      created++;
    }

    return { created, failed, errors };
  }

  async adminImportModules(programId: string, csvText: string) {
    const rows = this.parseCsv(csvText);
    const errors: string[] = [];
    let created = 0;
    let failed = 0;

    for (const row of rows) {
      const data = row.data;
      if (!data.title) {
        failed++;
        errors.push(`Row ${row.rowNumber}: Missing title.`);
        continue;
      }
      let unlockDate: Date | null = null;
      if (data.unlockDate) {
        const parsed = new Date(data.unlockDate);
        if (Number.isNaN(parsed.getTime())) {
          errors.push(`Row ${row.rowNumber}: Invalid unlockDate "${data.unlockDate}".`);
        } else {
          unlockDate = parsed;
        }
      }

      await this.databaseService.module.create({
        data: {
          programId,
          title: data.title,
          order: Number(data.order) || 1,
          unlockDate,
        },
      });
      created++;
    }

    return { created, failed, errors };
  }

  async adminImportEnrollments(csvText: string) {
    const rows = this.parseCsv(csvText);
    const errors: string[] = [];
    let created = 0;
    let failed = 0;

    for (const row of rows) {
      const data = row.data;
      const userEmail = data.userEmail || data.email;
      const programId = data.programId;
      const programTitle = data.programTitle;
      const status = (data.status || 'PENDING').toUpperCase();

      if (!userEmail) {
        failed++;
        errors.push(`Row ${row.rowNumber}: Missing userEmail.`);
        continue;
      }

      const user = await this.databaseService.user.findFirst({
        where: { email: userEmail },
        select: { id: true },
      });
      if (!user) {
        failed++;
        errors.push(`Row ${row.rowNumber}: User not found (${userEmail}).`);
        continue;
      }

      let program = null;
      if (programId) {
        program = await this.databaseService.program.findUnique({
          where: { id: programId },
          select: { id: true },
        });
      } else if (programTitle) {
        program = await this.databaseService.program.findFirst({
          where: { title: programTitle },
          select: { id: true },
        });
      }

      if (!program) {
        failed++;
        errors.push(`Row ${row.rowNumber}: Program not found.`);
        continue;
      }

      if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        failed++;
        errors.push(`Row ${row.rowNumber}: Invalid status "${data.status}".`);
        continue;
      }

      await this.databaseService.programEnrollment.upsert({
        where: { userId_programId: { userId: user.id, programId: program.id } },
        update: {
          status,
          reviewedAt: status === 'PENDING' ? null : new Date(),
        },
        create: {
          userId: user.id,
          programId: program.id,
          status,
          reviewedAt: status === 'PENDING' ? null : new Date(),
        },
      });

      created++;
    }

    return { created, failed, errors };
  }

  async adminListSubmissions(status?: string, programId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (programId) {
      where.task = { module: { programId } };
    }

    return this.databaseService.userTaskSubmission.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
        task: {
          include: {
            module: {
              select: {
                id: true,
                title: true,
                program: { select: { id: true, title: true } },
              },
            },
          },
        },
      },
    });
  }

  async adminUpdateSubmission(
    id: string,
    body: { status: string; feedback?: string },
  ) {
    const submission = await this.databaseService.userTaskSubmission.update({
      where: { id },
      data: {
        status: body.status as any,
        feedback: body.feedback ?? null,
      },
      include: {
        user: { select: { email: true } },
        task: {
          select: {
            title: true,
            module: { select: { program: { select: { title: true } } } },
          },
        },
      },
    });
    const message =
      body.status === 'APPROVED'
        ? 'Your assignment submission has been approved.'
        : body.status === 'REJECTED'
        ? `Your assignment submission was rejected${body.feedback ? `: ${body.feedback}` : '.'}`
        : 'Your assignment submission status was updated.';
    await this.notificationsService.create(submission.userId, message);
    if (submission.user?.email) {
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #111;">Assignment update</h2>
          <p>Your submission for <strong>${submission.task?.title}</strong> in <strong>${submission.task?.module?.program?.title}</strong> was ${body.status?.toLowerCase()}.</p>
          ${body.feedback ? `<p>Feedback: ${body.feedback}</p>` : ''}
          <p style="margin-top: 24px; color: #555;">NaajihBiz Academy</p>
        </div>
      `;
      await this.mailerService.sendMail(
        submission.user.email,
        'Assignment update',
        html,
      );
    }
    return submission;
  }

  async adminListEnrollments(status?: string, programId?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (programId) where.programId = programId;

    return this.databaseService.programEnrollment.findMany({
      where,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
        program: { select: { id: true, title: true, cohort: true } },
      },
    });
  }

  async adminUpdateEnrollment(
    id: string,
    body: { status: string; feedback?: string },
  ) {
    const enrollment = await this.databaseService.programEnrollment.update({
      where: { id },
      data: {
        status: body.status as any,
        reviewedAt: new Date(),
      },
      include: {
        user: { select: { email: true } },
        program: { select: { title: true, cohort: true } },
      },
    });
    const message =
      body.status === 'APPROVED'
        ? 'Your enrollment request has been approved. Welcome to the cohort!'
        : body.status === 'REJECTED'
        ? 'Your enrollment request was declined. You can reapply.'
        : 'Your enrollment status was updated.';
    await this.notificationsService.create(enrollment.userId, message);
    if (enrollment.user?.email) {
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #111;">Enrollment update</h2>
          <p>Your enrollment request for <strong>${enrollment.program?.title}</strong> has been ${body.status?.toLowerCase()}.</p>
          <p>Cohort: ${enrollment.program?.cohort || 'N/A'}</p>
          <p style="margin-top: 24px; color: #555;">NaajihBiz Academy</p>
        </div>
      `;
      await this.mailerService.sendMail(
        enrollment.user.email,
        'Enrollment update',
        html,
      );
    }
    return enrollment;
  }

  async getCertificate(userId: string, programId: string) {
    const subscription = await this.databaseService.subscription.findUnique({
      where: { userId },
    });
    const activeUntil = subscription?.endDate || subscription?.trialEndsAt;
    const hasPremium =
      subscription?.plan === 'PREMIUM' &&
      (!activeUntil || activeUntil > new Date());
    if (!hasPremium) {
      throw new ForbiddenException('Premium subscription required.');
    }

    const program = await this.databaseService.program.findUnique({
      where: { id: programId },
      select: { id: true, title: true, cohort: true },
    });

    if (!program) return null;

    const milestoneTitle = `Completed: ${program.title}`;
    const milestone = await this.databaseService.milestone.findFirst({
      where: { title: milestoneTitle },
    });

    if (!milestone) return null;

    const achieved = await this.databaseService.userMilestone.findFirst({
      where: { userId, milestoneId: milestone.id },
      include: {
        user: {
          select: {
            email: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!achieved) return null;

    const profile =
      achieved.user?.entrepreneurProfile ||
      achieved.user?.investorProfile ||
      null;
    const fullName = profile
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : achieved.user?.email;

    return {
      program,
      milestone,
      achievedAt: achieved.achievedAt,
      recipient: fullName || 'Learner',
      userId,
    };
  }

  async verifyCertificate(programId: string, userId: string) {
    const program = await this.databaseService.program.findUnique({
      where: { id: programId },
      select: { id: true, title: true, cohort: true },
    });

    if (!program) return null;

    const milestoneTitle = `Completed: ${program.title}`;
    const milestone = await this.databaseService.milestone.findFirst({
      where: { title: milestoneTitle },
    });

    if (!milestone) return null;

    const achieved = await this.databaseService.userMilestone.findFirst({
      where: { userId, milestoneId: milestone.id },
      include: {
        user: {
          select: {
            email: true,
            entrepreneurProfile: { select: { firstName: true, lastName: true } },
            investorProfile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    if (!achieved) return null;

    const profile =
      achieved.user?.entrepreneurProfile ||
      achieved.user?.investorProfile ||
      null;
    const fullName = profile
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : achieved.user?.email;

    return {
      valid: true,
      program,
      achievedAt: achieved.achievedAt,
      recipient: fullName || 'Learner',
    };
  }

  // 8️⃣ SEED PROGRAMS + MODULES + LESSONS
  async getCertificatePdf(userId: string, programId: string) {
    const certificate = await this.getCertificate(userId, programId);
    if (!certificate) return null;

    const { PDFDocument, rgb, StandardFonts, degrees } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 landscape
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const primary = rgb(0.18, 0.64, 0.47);
    page.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: primary,
      borderWidth: 3,
    });

    page.drawText('NAAJIH BIZ', {
      x: 120,
      y: 260,
      size: 64,
      font: boldFont,
      color: rgb(0.92, 0.95, 0.94),
      rotate: degrees(-18),
    });

    const logoUrl = process.env.CERT_LOGO_URL;
    if (logoUrl) {
      try {
        const resp = await fetch(logoUrl);
        if (resp.ok) {
          const bytes = await resp.arrayBuffer();
          const contentType = resp.headers.get('content-type') || '';
          const image =
            contentType.includes('png')
              ? await pdfDoc.embedPng(bytes)
              : await pdfDoc.embedJpg(bytes);
          const logoDims = image.scale(0.2);
          page.drawImage(image, {
            x: width - logoDims.width - 70,
            y: height - logoDims.height - 70,
            width: logoDims.width,
            height: logoDims.height,
            opacity: 0.6,
          });
        }
      } catch (error) {
        // Ignore logo failures
      }
    }

    page.drawText('NaajihBiz Academy', {
      x: 60,
      y: height - 90,
      size: 18,
      font: boldFont,
      color: primary,
    });

    page.drawText('Certificate of Completion', {
      x: 60,
      y: height - 140,
      size: 28,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText('This certifies that', {
      x: 60,
      y: height - 190,
      size: 14,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(certificate.recipient, {
      x: 60,
      y: height - 230,
      size: 24,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    page.drawText('has successfully completed', {
      x: 60,
      y: height - 265,
      size: 14,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    page.drawText(certificate.program.title, {
      x: 60,
      y: height - 300,
      size: 20,
      font: boldFont,
      color: primary,
    });

    const awarded = new Date(certificate.achievedAt).toLocaleDateString('en-NG', {
      dateStyle: 'long',
    });

    page.drawText(`Awarded on ${awarded}`, {
      x: 60,
      y: height - 340,
      size: 12,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawLine({
      start: { x: 60, y: 160 },
      end: { x: 260, y: 160 },
      thickness: 1,
      color: rgb(0.6, 0.6, 0.6),
    });
    page.drawText('Program Director', {
      x: 60,
      y: 140,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawLine({
      start: { x: width - 260, y: 160 },
      end: { x: width - 60, y: 160 },
      thickness: 1,
      color: rgb(0.6, 0.6, 0.6),
    });
    page.drawText('NaajihBiz Academy', {
      x: width - 260,
      y: 140,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });

    const verificationUrl = `${process.env.APP_BASE_URL || 'http://localhost:3001'}/certificate/verify/${certificate.program.id}/${certificate.userId}`;
    page.drawText('Verify certificate:', {
      x: 60,
      y: 90,
      size: 10,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawText(verificationUrl, {
      x: 60,
      y: 72,
      size: 9,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  async seed() {
    const now = new Date();
    const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const programsData = [
      {
        title: '1. Build a Profitable Business in 30 Days',
        description:
          'The Flagship Program. Go from zero to your first customer in one month. No theory, just execution.',
        cohort: 'Cohort 1 (Feb 2026)',
        isPremium: false,
        modules: [
          {
            title: 'Week 1: Finding a Pain-Killer Idea',
            order: 1,
            unlockDate: now,
            lessons: [
              {
                title: 'The Pain-Killer Framework',
                order: 1,
                videoUrl: '', // ✅ FIXED: Replaced ", with ""
                content:
                  "<h3>The Pain-Killer Framework</h3><p>Don't build vitamins. Build Pain-Killers. Go to the market and find 10 people screaming for a solution.</p><strong>Task:</strong> Interview 5 potential customers today.",
                contentType: 'video',
                duration: 600,
              },
              {
                title: 'Interview Customers',
                order: 2,
                videoUrl: '', // ✅ FIXED
                content: 'Task: Interview 5 potential customers today.',
                contentType: 'video',
                duration: 300,
              },
            ],
            tasks: [
              {
                title: 'Customer Interview Summary',
                description:
                  'Interview at least 5 potential customers and submit a 1-page summary.',
                dueDate: weekFromNow,
              },
            ],
          },
          {
            title: 'Week 2: The MVP (Minimum Viable Product)',
            order: 2,
            unlockDate: weekFromNow,
            lessons: [
              {
                title: 'Build it Ugly',
                order: 1,
                videoUrl: '', // ✅ FIXED
                content:
                  "<h3>Build it Ugly</h3><p>If you aren't embarrassed by your first version, you launched too late. Do not code yet. Use WhatsApp, Excel, or paper.</p>",
                contentType: 'video',
                duration: 600,
              },
            ],
            tasks: [
              {
                title: 'MVP Validation',
                description:
                  'Build a scrappy MVP and collect feedback from 3 potential users.',
                dueDate: twoWeeksFromNow,
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

      if (existingProgram) {
        for (const mod of programData.modules) {
          const existingModule = await this.databaseService.module.findFirst({
            where: {
              programId: existingProgram.id,
              title: mod.title,
            },
          });

          if (!existingModule) {
            await this.databaseService.module.create({
              data: {
                title: mod.title,
                order: mod.order,
                unlockDate: mod.unlockDate,
                programId: existingProgram.id,
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
                tasks: {
                  create: (mod.tasks || []).map((task) => ({
                    title: task.title,
                    description: task.description,
                    dueDate: task.dueDate,
                  })),
                },
              },
            });
            continue;
          }

          await this.databaseService.module.update({
            where: { id: existingModule.id },
            data: { unlockDate: mod.unlockDate },
          });

          for (const lesson of mod.lessons) {
            const existingLesson = await this.databaseService.lesson.findFirst({
              where: {
                moduleId: existingModule.id,
                title: lesson.title,
              },
            });

            if (!existingLesson) {
              await this.databaseService.lesson.create({
                data: {
                  moduleId: existingModule.id,
                  title: lesson.title,
                  order: lesson.order,
                  videoUrl: lesson.videoUrl,
                  content: lesson.content,
                  contentType: lesson.contentType,
                  duration: lesson.duration,
                },
              });
            }
          }

          for (const task of mod.tasks || []) {
            const existingTask = await this.databaseService.task.findFirst({
              where: {
                moduleId: existingModule.id,
                title: task.title,
              },
            });

            if (!existingTask) {
              await this.databaseService.task.create({
                data: {
                  moduleId: existingModule.id,
                  title: task.title,
                  description: task.description,
                  dueDate: task.dueDate,
                },
              });
            }
          }
        }

        continue;
      }

      if (!existingProgram) {
        await this.databaseService.program.create({
          data: {
            title: programData.title,
            description: programData.description,
            cohort: programData.cohort,
            isPremium: Boolean(programData.isPremium),
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
                tasks: {
                  create: (mod.tasks || []).map((task) => ({
                    title: task.title,
                    description: task.description,
                    dueDate: task.dueDate,
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

  private addProgramComputedFields(programs: any[]) {
    const now = new Date();
    return programs.map((program) => {
      const modules = program.modules?.map((mod: any) => {
        const isUnlocked = !mod.unlockDate || new Date(mod.unlockDate) <= now;
        return { ...mod, isUnlocked };
      });

      return {
        ...program,
        modules,
      };
    });
  }

  private async awardProgramCompletionMilestone(userId: string, lessonId: string) {
    const lesson = await this.databaseService.lesson.findUnique({
      where: { id: lessonId },
      select: {
        module: {
          select: {
            programId: true,
            program: { select: { title: true } },
          },
        },
      },
    });

    const programId = lesson?.module?.programId;
    const programTitle = lesson?.module?.program?.title;
    if (!programId || !programTitle) return null;

    const totalLessons = await this.databaseService.lesson.count({
      where: { module: { programId } },
    });
    const completedLessons = await this.databaseService.userLessonProgress.count({
      where: {
        userId,
        isCompleted: true,
        lesson: { module: { programId } },
      },
    });

    if (totalLessons === 0 || completedLessons < totalLessons) {
      return null;
    }

    const milestoneTitle = `Completed: ${programTitle}`;
    let milestone = await this.databaseService.milestone.findFirst({
      where: { title: milestoneTitle },
    });

    if (!milestone) {
      milestone = await this.databaseService.milestone.create({
        data: {
          title: milestoneTitle,
          description: 'Program completion certificate unlocked.',
        },
      });
    }

    const existing = await this.databaseService.userMilestone.findFirst({
      where: { userId, milestoneId: milestone.id },
    });

    if (existing) {
      return existing;
    }

    return this.databaseService.userMilestone.create({
      data: {
        userId,
        milestoneId: milestone.id,
      },
    });
  }

  private parseCsv(csvText: string) {
    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) return [];

    const headers = this.parseCsvLine(lines[0]).map((h) => h.trim());
    const rows = [];

    for (const [index, line] of lines.slice(1).entries()) {
      const values = this.parseCsvLine(line);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ?? '';
      });
      rows.push({ rowNumber: index + 2, data: row });
    }

    return rows;
  }

  private parseCsvLine(line: string) {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
        continue;
      }
      if (char === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
        continue;
      }
      current += char;
    }

    result.push(current);
    return result.map((value) => value.trim());
  }
}
