import { Test, TestingModule } from '@nestjs/testing';
import { AcedemyService } from './acedemy.service';

describe('AcedemyService', () => {
  let service: AcedemyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcedemyService],
    }).compile();

    service = module.get<AcedemyService>(AcedemyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
