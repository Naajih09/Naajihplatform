import { Test, TestingModule } from '@nestjs/testing';
import { AcademyService } from './acedemy.service';

describe('AcademyService', () => {
  let service: AcademyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademyService],
    }).compile();

    service = module.get<AcademyService>(AcademyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
