import { Test, TestingModule } from '@nestjs/testing';
import { TipoPlanningController } from './tipo_planning.controller';
import { TipoPlanningService } from './tipo_planning.service';

describe('TipoPlanningController', () => {
  let controller: TipoPlanningController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoPlanningController],
      providers: [TipoPlanningService],
    }).compile();

    controller = module.get<TipoPlanningController>(TipoPlanningController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
