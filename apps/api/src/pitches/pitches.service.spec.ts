import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma.service';
import { PitchesService } from './pitches.service';

describe('PitchesService', () => {
  let service: PitchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PitchesService,
        { provide: PrismaService, useValue: {} },
        { provide: AuditService, useValue: {} },
      ],
    }).compile();

    service = module.get<PitchesService>(PitchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
