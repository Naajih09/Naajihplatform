import { Test, TestingModule } from '@nestjs/testing';
import { AppCacheService } from '../cache/app-cache.service';
import { DatabaseService } from '../database/database.service';
import { MailerService } from '../mailer/mailer.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AcademyService } from './academy.service';

describe('AcademyService', () => {
  let service: AcademyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcademyService,
        { provide: DatabaseService, useValue: {} },
        { provide: NotificationsService, useValue: {} },
        { provide: MailerService, useValue: {} },
        { provide: AppCacheService, useValue: {} },
      ],
    }).compile();

    service = module.get<AcademyService>(AcademyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
