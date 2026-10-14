import { WaitlistService } from './waitlist.service';

describe('WaitlistService invitations', () => {
  const databaseService: any = {
    waitlist: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  const mailerService: any = { sendMail: jest.fn() };
  const service = new WaitlistService(databaseService, mailerService);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('marks an email-list entry notified only after successful delivery', async () => {
    databaseService.waitlist.findUnique.mockResolvedValue({
      id: 'entry-1',
      email: 'founder@example.com',
      firstName: '<Amina>',
    });
    mailerService.sendMail.mockResolvedValue(true);
    databaseService.waitlist.update.mockResolvedValue({ id: 'entry-1' });

    const result = await service.invite(['entry-1'], 'Launch <now>');

    expect(result).toMatchObject({ processed: 1, failed: 0 });
    expect(mailerService.sendMail.mock.calls[0][2]).toContain('Hi &lt;Amina&gt;');
    expect(mailerService.sendMail.mock.calls[0][2]).toContain('Launch &lt;now&gt;');
    expect(databaseService.waitlist.update).toHaveBeenCalledWith({
      where: { id: 'entry-1' },
      data: { isNotified: true },
    });
  });

  it('leaves an entry retryable when email delivery fails', async () => {
    databaseService.waitlist.findUnique.mockResolvedValue({
      id: 'entry-2',
      email: 'investor@example.com',
      firstName: 'Sam',
    });
    mailerService.sendMail.mockResolvedValue(false);

    const result = await service.invite(['entry-2']);

    expect(result).toEqual({
      processed: 0,
      results: [],
      failed: 1,
      failedIds: ['entry-2'],
    });
    expect(databaseService.waitlist.update).not.toHaveBeenCalled();
  });
});
