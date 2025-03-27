import { Test, TestingModule } from '@nestjs/testing';
import { TipoPlanningService } from './tipo_planning.service';

describe('TipoPlanningService', () => {
  let service: TipoPlanningService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoPlanningService],
    }).compile();

    service = module.get<TipoPlanningService>(TipoPlanningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
