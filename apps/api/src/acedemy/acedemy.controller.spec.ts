import { Test, TestingModule } from '@nestjs/testing';
import { AcedemyController } from './acedemy.controller';
import { AcedemyService } from './acedemy.service';

describe('AcedemyController', () => {
  let controller: AcedemyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcedemyController],
      providers: [AcedemyService],
    }).compile();

    controller = module.get<AcedemyController>(AcedemyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
