import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { DatabaseService } from '../database/database.service';
import { NotificationsGateway } from './notifications.gateway';
import { MailerService } from '../mailer/mailer.service';

describe('NotificationsService', () => {
  let service: NotificationsService;
  const databaseService = {
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };
  const notificationsGateway = { sendNotification: jest.fn() };
  const mailerService = { sendMail: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    delete process.env.NOTIFICATION_EMAIL_ENABLED;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: DatabaseService, useValue: databaseService },
        { provide: NotificationsGateway, useValue: notificationsGateway },
        { provide: MailerService, useValue: mailerService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sends in-app and email notifications when email is enabled', async () => {
    process.env.NOTIFICATION_EMAIL_ENABLED = 'true';
    databaseService.notification.create.mockResolvedValue({
      id: 'notification-1',
      userId: 'user-1',
      message: 'Pitch approved',
    });
    databaseService.user.findUnique.mockResolvedValue({
      email: 'user@example.com',
      emailVerified: true,
    });
    mailerService.sendMail.mockResolvedValue(true);

    const result = await service.create('user-1', 'Pitch approved');

    expect(result.id).toBe('notification-1');
    expect(notificationsGateway.sendNotification).toHaveBeenCalledWith(
      'user-1',
      result,
    );
    expect(mailerService.sendMail).toHaveBeenCalledWith(
      'user@example.com',
      'Naajih Notification',
      expect.stringContaining('Pitch approved'),
    );
  });

  it('keeps the notification when email delivery throws', async () => {
    process.env.NOTIFICATION_EMAIL_ENABLED = 'true';
    databaseService.notification.create.mockResolvedValue({
      id: 'notification-1',
      userId: 'user-1',
      message: 'Verification approved',
    });
    databaseService.user.findUnique.mockResolvedValue({
      email: 'user@example.com',
      emailVerified: true,
    });
    mailerService.sendMail.mockRejectedValue(new Error('SMTP down'));

    await expect(
      service.create('user-1', 'Verification approved'),
    ).resolves.toMatchObject({ id: 'notification-1' });
  });
});
