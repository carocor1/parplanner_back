import { Test, TestingModule } from '@nestjs/testing';
import { PropuestasParticionService } from './propuestas_particion.service';

describe('PropuestasParticionService', () => {
  let service: PropuestasParticionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropuestasParticionService],
    }).compile();

    service = module.get<PropuestasParticionService>(PropuestasParticionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
