import { Test, TestingModule } from '@nestjs/testing';
import { PitchesController } from './pitches.controller';
import { PitchesService } from './pitches.service';

describe('PitchesController', () => {
  let controller: PitchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PitchesController],
      providers: [PitchesService],
    }).compile();

    controller = module.get<PitchesController>(PitchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
