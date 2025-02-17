import { Test, TestingModule } from '@nestjs/testing';
import { PropuestasParticionController } from './propuestas_particion.controller';
import { PropuestasParticionService } from './propuestas_particion.service';

describe('PropuestasParticionController', () => {
  let controller: PropuestasParticionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropuestasParticionController],
      providers: [PropuestasParticionService],
    }).compile();

    controller = module.get<PropuestasParticionController>(PropuestasParticionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
