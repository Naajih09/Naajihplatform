import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../audit/audit.service';
import { DatabaseService } from '../database/database.service';
import { NotificationsService } from '../notifications/notifications.service';
import { VerificationService } from './verification.service';

describe('VerificationService', () => {
  let service: VerificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerificationService,
        { provide: DatabaseService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: AuditService, useValue: {} },
      ],
    }).compile();

    service = module.get<VerificationService>(VerificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
