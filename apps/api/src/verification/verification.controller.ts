import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { UserRole, VerificationStatus, VerificationType } from '@prisma/client';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

export class SubmitVerificationDto {
  @IsUrl()
  @IsNotEmpty()
  documentUrl: string;

  @IsEnum(VerificationType)
  @IsOptional()
  verificationType?: VerificationType;

  @IsBoolean()
  @IsOptional()
  consentAccepted?: boolean;
}

export class StartProviderVerificationDto {
  @IsEnum(VerificationType)
  @IsOptional()
  verificationType?: VerificationType;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsBoolean()
  consentAccepted: boolean;

  @IsString()
  @IsOptional()
  businessName?: string;

  @IsString()
  @IsOptional()
  cacNumber?: string;
}

export class UpdateVerificationStatusDto {
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('submit')
  @Roles(UserRole.ENTREPRENEUR, UserRole.INVESTOR)
  submitVerification(
    @Body() body: SubmitVerificationDto,
    @Request() req,
  ) {
    return this.verificationService.create({
      userId: req.user.id,
      documentUrl: body.documentUrl,
      verificationType: body.verificationType,
      consentAccepted: body.consentAccepted,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('provider/start')
  @Roles(UserRole.ENTREPRENEUR, UserRole.INVESTOR)
  startProviderVerification(
    @Body() body: StartProviderVerificationDto,
    @Request() req,
  ) {
    return this.verificationService.startProviderSession({
      userId: req.user.id,
      verificationType: body.verificationType,
      provider: body.provider,
      consentAccepted: body.consentAccepted,
      businessName: body.businessName,
      cacNumber: body.cacNumber,
    });
  }

  @Post('provider/webhook')
  providerWebhook(
    @Body() body: any,
    @Headers('x-verification-webhook-secret') signature?: string,
  ) {
    return this.verificationService.handleProviderWebhook({
      ...body,
      signature,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/pending')
  @Roles(UserRole.ADMIN)
  getPendingVerifications(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.verificationService.findAllPending({
      page,
      pageSize,
      status,
      search,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('admin/:id')
  @Roles(UserRole.ADMIN)
  updateVerificationStatus(
    @Param('id') id: string,
    @Body() body: UpdateVerificationStatusDto,
    @Request() req,
  ) {
    if (
      body.status !== VerificationStatus.APPROVED &&
      body.status !== VerificationStatus.REJECTED &&
      body.status !== VerificationStatus.FLAGGED
    ) {
      throw new ForbiddenException(
        'Status must be APPROVED, REJECTED, or FLAGGED.',
      );
    }

    return this.verificationService.updateStatus(
      id,
      body.status,
      body.rejectionReason,
      req.user.id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':userId')
  @Roles(UserRole.ENTREPRENEUR, UserRole.INVESTOR, UserRole.ADMIN)
  getVerificationStatus(
    @Param('userId') userId: string,
    @Query('type') type: string | undefined,
    @Request() req,
  ) {
    if (req.user.role !== UserRole.ADMIN && req.user.id !== userId) {
      throw new ForbiddenException(
        'You can only view your own verification status.',
      );
    }

    return this.verificationService.getStatus(userId, type);
  }
}
