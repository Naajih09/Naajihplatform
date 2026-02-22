import { Test, TestingModule } from '@nestjs/testing';
import { AcademyController } from './acedemy.controller';
import { AcademyService } from './acedemy.service';

describe('AcademyController', () => {
  let controller: AcademyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademyController],
      providers: [AcademyService],
    }).compile();

    controller = module.get<AcademyController>(AcademyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
