import { Test, TestingModule } from '@nestjs/testing';
import { AcademyController } from './academy.controller';
import { AcademyService } from './academy.service';
import { DatabaseService } from '../database/database.service';

describe('AcademyController', () => {
  let controller: AcademyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcademyController],
      providers: [
        {
          provide: AcademyService,
          useValue: {},
        },
        {
          provide: DatabaseService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AcademyController>(AcademyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
