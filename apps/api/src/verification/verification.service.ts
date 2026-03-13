import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class VerificationService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly notificationsService: NotificationsService,
  ) {}

  // 1. SUBMIT REQUEST (User)
  async create(data: { userId: string; documentUrl: string }) {
    const existing = await this.databaseService.verificationRequest.findUnique({
      where: { userId: data.userId }
    });

    // If resubmitting, update existing record and reset reason
    if (existing) {
      return this.databaseService.verificationRequest.update({
        where: { userId: data.userId },
        data: { 
          documentUrl: data.documentUrl,
          status: 'PENDING',
          rejectionReason: null 
        }
      });
    }

    return this.databaseService.verificationRequest.create({
      data: {
        userId: data.userId,
        documentUrl: data.documentUrl,
        status: 'PENDING'
      }
    });
  }

  // 2. GET STATUS (User)
  async getStatus(userId: string) {
    return this.databaseService.verificationRequest.findUnique({
      where: { userId }
    });
  }

  // 3. ADMIN: GET ALL PENDING
  async findAllPending() {
    return this.databaseService.verificationRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          include: { entrepreneurProfile: true, investorProfile: true }
        }
      }
    });
  }

  // 4. ADMIN: APPROVE/REJECT
  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) {
    // 1. Update the Request
    const request = await this.databaseService.verificationRequest.update({
      where: { id },
      data: { 
        status,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null
      }
    });

    // 2. Update the User's overall verification status
    if (status === 'APPROVED') {
      await this.databaseService.user.update({
        where: { id: request.userId },
        data: { isVerified: true }
      });
    } else if (status === 'REJECTED') {
      await this.databaseService.user.update({
        where: { id: request.userId },
        data: { isVerified: false }
      });
    }

    // 3. Notify User
    const message = status === 'REJECTED' && rejectionReason
      ? `Your verification request was rejected. Reason: ${rejectionReason}`
      : `Your verification request has been ${status.toLowerCase()}.`;
      
    await this.notificationsService.create(request.userId, message);

    return request;
  }
}