import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

// --- Embedded DTOs ---
export class CreateVerificationDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  documentUrl: string; // The frontend will upload to Cloudinary and pass the URL here
}

export class UpdateVerificationStatusDto {
  @IsEnum(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  // User: Submit
  @Post()
  create(@Body() body: CreateVerificationDto) {
    return this.verificationService.create(body);
  }

  // Admin: Get Pending
  // TODO: Add @UseGuards(JwtAuthGuard, RolesGuard) and @Roles('ADMIN') once auth module is finished
  @Get('admin/pending')
  findAllPending() {
    return this.verificationService.findAllPending();
  }

  // Admin: Approve/Reject
  // TODO: Add @UseGuards(JwtAuthGuard, RolesGuard) and @Roles('ADMIN')
  @Patch('admin/:id')
  updateStatus(
    @Param('id') id: string, 
    @Body() body: UpdateVerificationStatusDto
  ) {
    return this.verificationService.updateStatus(id, body.status, body.rejectionReason);
  }

  // User: Check Status
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.verificationService.getStatus(userId);
  }
}