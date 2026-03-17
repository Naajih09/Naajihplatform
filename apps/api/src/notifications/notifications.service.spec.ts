import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { DatabaseService } from '../database/database.service';
import { NotificationsGateway } from './notifications.gateway';
import { MailerService } from '../mailer/mailer.service';

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: DatabaseService, useValue: {} },
        { provide: NotificationsGateway, useValue: { sendNotification: jest.fn() } },
        { provide: MailerService, useValue: { sendMail: jest.fn() } },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
