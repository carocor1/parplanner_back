import { Test, TestingModule } from '@nestjs/testing';
import { HijosController } from './hijos.controller';
import { HijosService } from './hijos.service';

describe('HijosController', () => {
  let controller: HijosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HijosController],
      providers: [HijosService],
    }).compile();

    controller = module.get<HijosController>(HijosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
