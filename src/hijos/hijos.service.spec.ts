import { Test, TestingModule } from '@nestjs/testing';
import { HijosService } from './hijos.service';

describe('HijosService', () => {
  let service: HijosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HijosService],
    }).compile();

    service = module.get<HijosService>(HijosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
