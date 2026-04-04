import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  Res,
} from '@nestjs/common';
import { AcademyService } from './academy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TaskStatus, UserRole } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';

@Controller('academy')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademyController {
  constructor(private readonly academyService: AcademyService) {}

  @Get()
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
  )
  findAll(@Request() req) {
    return this.academyService.findAll(req.user.id);
  }

  @Get(':id')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
  )
  findOne(@Param('id') id: string, @Request() req) {
    return this.academyService.findOne(id, req.user.id);
  }

  @Post('lesson/:lessonId/complete')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
  )
  completeLesson(@Param('lessonId') lessonId: string, @Request() req) {
    return this.academyService.completeLesson(req.user.id, lessonId);
  }

  @Get('lesson/:id')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
  )
  getLesson(@Param('id') id: string, @Request() req) {
    return this.academyService.getLesson(id, req.user.id);
  }

  @Post('join/:programId')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
  )
  joinProgram(@Param('programId') programId: string, @Request() req) {
    return this.academyService.joinProgram(req.user.id, programId);
  }

  @Post('task/:taskId/submit')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
  )
  submitTask(
    @Param('taskId') taskId: string,
    @Request() req,
    @Body() body: { submissionUrl?: string },
  ) {
    return this.academyService.submitTask(
      req.user.id,
      taskId,
      body?.submissionUrl,
    );
  }

  @Get('milestones')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
  )
  getMilestones(@Request() req) {
    return this.academyService.getUserMilestones(req.user.id);
  }

  @Get('certificate/:programId')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
  )
  getCertificate(@Param('programId') programId: string, @Request() req) {
    return this.academyService.getCertificate(req.user.id, programId);
  }

  @Get('certificate/:programId/pdf')
  @Roles(
    UserRole.ASPIRING_BUSINESS_OWNER,
    UserRole.ENTREPRENEUR,
    UserRole.INVESTOR,
  )
  async getCertificatePdf(
    @Param('programId') programId: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const pdf = await this.academyService.getCertificatePdf(
      req.user.id,
      programId,
    );
    if (!pdf) {
      return res.status(404).json({ message: 'Certificate not available.' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="certificate.pdf"',
    );
    return res.send(pdf);
  }

  @Post('seed')
  @Roles(UserRole.ADMIN)
  seed() {
    return this.academyService.seed();
  }

  // ---------------- ADMIN ACADEMY MANAGEMENT ----------------
  @Get('admin/programs')
  @Roles(UserRole.ADMIN)
  adminListPrograms() {
    return this.academyService.adminListPrograms();
  }

  @Get('admin/programs/:id')
  @Roles(UserRole.ADMIN)
  adminGetProgram(@Param('id') id: string) {
    return this.academyService.adminGetProgram(id);
  }

  @Post('admin/programs')
  @Roles(UserRole.ADMIN)
  adminCreateProgram(
    @Body()
    body: {
      title: string;
      description?: string;
      cohort?: string;
      isPremium?: boolean;
    },
  ) {
    return this.academyService.adminCreateProgram(body);
  }

  @Post('admin/programs/import')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  adminImportPrograms(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.academyService.adminImportPrograms(
      file.buffer.toString('utf-8'),
    );
  }

  @Patch('admin/programs/:id')
  @Roles(UserRole.ADMIN)
  adminUpdateProgram(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      description?: string;
      cohort?: string;
      isPremium?: boolean;
    },
  ) {
    return this.academyService.adminUpdateProgram(id, body);
  }

  @Delete('admin/programs/:id')
  @Roles(UserRole.ADMIN)
  adminDeleteProgram(@Param('id') id: string) {
    return this.academyService.adminDeleteProgram(id);
  }

  @Post('admin/programs/:id/modules')
  @Roles(UserRole.ADMIN)
  adminCreateModule(
    @Param('id') programId: string,
    @Body()
    body: { title: string; order?: number; unlockDate?: string },
  ) {
    return this.academyService.adminCreateModule(programId, body);
  }

  @Post('admin/programs/:id/modules/import')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  adminImportModules(
    @Param('id') programId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.academyService.adminImportModules(
      programId,
      file.buffer.toString('utf-8'),
    );
  }

  @Patch('admin/modules/:id')
  @Roles(UserRole.ADMIN)
  adminUpdateModule(
    @Param('id') id: string,
    @Body()
    body: { title?: string; order?: number; unlockDate?: string | null },
  ) {
    return this.academyService.adminUpdateModule(id, body);
  }

  @Post('admin/modules/:id/lessons')
  @Roles(UserRole.ADMIN)
  adminCreateLesson(
    @Param('id') moduleId: string,
    @Body()
    body: {
      title: string;
      order?: number;
      videoUrl?: string;
      content?: string;
      contentType?: string;
      duration?: number;
    },
  ) {
    return this.academyService.adminCreateLesson(moduleId, body);
  }

  @Post('admin/modules/:id/lessons/import')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  adminImportLessons(
    @Param('id') moduleId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.academyService.adminImportLessons(
      moduleId,
      file.buffer.toString('utf-8'),
    );
  }

  @Patch('admin/lessons/:id')
  @Roles(UserRole.ADMIN)
  adminUpdateLesson(
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      order?: number;
      videoUrl?: string | null;
      content?: string | null;
      contentType?: string;
      duration?: number;
    },
  ) {
    return this.academyService.adminUpdateLesson(id, body);
  }

  @Post('admin/modules/:id/tasks')
  @Roles(UserRole.ADMIN)
  adminCreateTask(
    @Param('id') moduleId: string,
    @Body()
    body: { title: string; description?: string; dueDate?: string },
  ) {
    return this.academyService.adminCreateTask(moduleId, body);
  }

  @Post('admin/modules/:id/tasks/import')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  adminImportTasks(
    @Param('id') moduleId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.academyService.adminImportTasks(
      moduleId,
      file.buffer.toString('utf-8'),
    );
  }

  @Patch('admin/tasks/:id')
  @Roles(UserRole.ADMIN)
  adminUpdateTask(
    @Param('id') id: string,
    @Body()
    body: { title?: string; description?: string; dueDate?: string | null },
  ) {
    return this.academyService.adminUpdateTask(id, body);
  }

  @Get('admin/submissions')
  @Roles(UserRole.ADMIN)
  adminListSubmissions(
    @Query('status') status?: TaskStatus,
    @Query('programId') programId?: string,
  ) {
    return this.academyService.adminListSubmissions(status, programId);
  }

  @Patch('admin/submissions/:id')
  @Roles(UserRole.ADMIN)
  adminUpdateSubmission(
    @Param('id') id: string,
    @Body() body: { status: TaskStatus; feedback?: string },
  ) {
    return this.academyService.adminUpdateSubmission(id, body);
  }

  @Get('admin/enrollments')
  @Roles(UserRole.ADMIN)
  adminListEnrollments(
    @Query('status') status?: string,
    @Query('programId') programId?: string,
  ) {
    return this.academyService.adminListEnrollments(status, programId);
  }

  @Patch('admin/enrollments/:id')
  @Roles(UserRole.ADMIN)
  adminUpdateEnrollment(
    @Param('id') id: string,
    @Body() body: { status: string; feedback?: string },
  ) {
    return this.academyService.adminUpdateEnrollment(id, body);
  }

  @Post('admin/enrollments/import')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  adminImportEnrollments(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1000000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.academyService.adminImportEnrollments(
      file.buffer.toString('utf-8'),
    );
  }
}
