// FIX: Added 'Patch' to the imports
import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  // User: Submit
  @Post()
  create(@Body() body: any) {
    return this.verificationService.create(body);
  }

  // Admin: Get Pending
  @Get('admin/pending')
  findAllPending() {
    return this.verificationService.findAllPending();
  }

  // Admin: Approve/Reject
  @Patch('admin/:id')
  updateStatus(@Param('id') id: string, @Body('status') status: 'APPROVED' | 'REJECTED') {
    return this.verificationService.updateStatus(id, status);
  }

  // User: Check Status
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.verificationService.getStatus(userId);
  }
}