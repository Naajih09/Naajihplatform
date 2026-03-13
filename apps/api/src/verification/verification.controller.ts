import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Request, 
  ForbiddenException, 
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, VerificationStatus } from '@prisma/client'; 

// DTO for submitting verification requests
// Consider moving this to `apps/api/src/verification/dto/submit-verification.dto.ts`
import { IsString, IsUrl, IsNotEmpty } from 'class-validator';

export class SubmitVerificationDto {
  @IsString()
  @IsNotEmpty()
  // userId should ideally come from the authenticated user, not the body
  // If you must pass it, validate it against the authenticated user's ID
  userId: string;

  @IsUrl()
  @IsNotEmpty()
  documentUrl: string;
}

// DTO for updating verification status
// Consider moving this to `apps/api/src/verification/dto/update-verification-status.dto.ts`
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateVerificationStatusDto {
  @IsEnum(VerificationStatus) // Use the Prisma enum
  status: VerificationStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

// Protect the whole controller with authentication and role checking
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  // 1️⃣ USER: Submit verification request
  // Entrepreneur/Investor can submit their own verification
  @Post('submit')
  @Roles(UserRole.ENTREPRENEUR, UserRole.INVESTOR)
  async submitVerification(
    @Body() submitVerificationDto: SubmitVerificationDto, // Use DTO
    @Request() req, // Get user info from JWT
  ) {
    // Ensure the userId in the body matches the authenticated user's ID
    if (req.user.id !== submitVerificationDto.userId) {
      throw new ForbiddenException('You can only submit verification for your own account.');
    }
    return this.verificationService.create(submitVerificationDto);
  }

  // 2️⃣ USER: Check verification status
  // Entrepreneur/Investor can check their own status
  @Get(':userId')
  @Roles(UserRole.ENTREPRENEUR, UserRole.INVESTOR, UserRole.ADMIN) // Admin can also check
  async getVerificationStatus(@Param('userId') userId: string, @Request() req) {
    // Ensure the userId in the param matches the authenticated user's ID, unless it's an ADMIN
    if (req.user.role !== UserRole.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException('You can only view your own verification status.');
    }
    return this.verificationService.getStatus(userId);
  }

  // 3️⃣ ADMIN: Get all pending verification requests
  @Get('admin/pending')
  @Roles(UserRole.ADMIN) // Only ADMIN
  getPendingVerifications() {
    return this.verificationService.findAllPending();
  }

  // 4️⃣ ADMIN: Approve or reject verification
  @Patch('admin/:id')
  @Roles(UserRole.ADMIN) // Only ADMIN
  updateVerificationStatus(
    @Param('id') id: string, // Verification Request ID
    @Body() updateVerificationStatusDto: UpdateVerificationStatusDto, // Use DTO
  ) {
    if (
      updateVerificationStatusDto.status !== 'APPROVED' &&
      updateVerificationStatusDto.status !== 'REJECTED'
    ) {
      throw new ForbiddenException('Status must be APPROVED or REJECTED.');
    }
    return this.verificationService.updateStatus(
      id,
      updateVerificationStatusDto.status as 'APPROVED' | 'REJECTED',
      updateVerificationStatusDto.rejectionReason,
    );
  }
}