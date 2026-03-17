import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { DatabaseService } from '../database/database.service';
import { NotificationsGateway } from './notifications.gateway';
import { MailerService } from '../mailer/mailer.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        NotificationsService,
        { provide: DatabaseService, useValue: {} },
        { provide: NotificationsGateway, useValue: { sendNotification: jest.fn() } },
        { provide: MailerService, useValue: { sendMail: jest.fn() } },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
