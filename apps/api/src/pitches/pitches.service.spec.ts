import { PitchStatus } from '@prisma/client';
import { AppCacheService } from '../cache/app-cache.service';
import { PitchesService } from './pitches.service';

describe('PitchesService feed visibility', () => {
  const prisma: any = {
    pitch: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };
  const auditService: any = {
    log: jest.fn(),
  };
  const cache: any = {
    deleteByPrefix: jest.fn(),
    getOrSet: jest.fn((_key: string, _ttl: number, factory: () => unknown) =>
      factory(),
    ),
  };
  const notificationsService: any = {
    create: jest.fn(),
  };
  const accessPolicy: any = {
    assertCanCreatePitch: jest.fn(),
  };

  const createService = () =>
    new PitchesService(
      prisma,
      auditService,
      cache,
      notificationsService,
      accessPolicy,
    );

  beforeEach(() => {
    jest.resetAllMocks();
    cache.getOrSet.mockImplementation(
      (_key: string, _ttl: number, factory: () => unknown) => factory(),
    );
    prisma.pitch.count.mockResolvedValue(0);
    prisma.pitch.findMany.mockResolvedValue([]);
  });

  it('filters public pitch lists to approved pitches only', async () => {
    const service = createService();

    await service.findAll({ page: '1', pageSize: '10' });

    expect(prisma.pitch.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([{ status: PitchStatus.APPROVED }]),
        }),
      }),
    );
  });

  it('allows admin pitch lists to include non-approved statuses', async () => {
    const service = createService();

    await service.findAll({
      page: '1',
      pageSize: '10',
      includeNonApproved: true,
      status: PitchStatus.REJECTED,
    });

    expect(prisma.pitch.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([{ status: PitchStatus.REJECTED }]),
        }),
      }),
    );
  });

  it('filters recommended pitches to approved pitches only', async () => {
    prisma.user.findUnique.mockResolvedValue({
      entrepreneurProfile: {
        industry: 'Fintech',
        focusIndustries: [],
      },
      investorProfile: null,
    });
    const service = createService();

    await service.getRecommended('user-1');

    expect(prisma.pitch.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: expect.arrayContaining([
            { status: PitchStatus.APPROVED },
            expect.objectContaining({ OR: expect.any(Array) }),
          ]),
        },
      }),
    );
  });
});
