import { Test, TestingModule } from '@nestjs/testing';
import { TipoPlanningService } from './tipo_planning.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TipoPlanning } from './entities/tipo_planning.entity';
import { Repository } from 'typeorm';

describe('TipoPlanningService', () => {
  let service: TipoPlanningService;
  let tipoPlanningRepository: jest.Mocked<Partial<Repository<TipoPlanning>>>;

  beforeEach(async () => {
    tipoPlanningRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TipoPlanningService,
        {
          provide: getRepositoryToken(TipoPlanning),
          useValue: tipoPlanningRepository,
        },
      ],
    }).compile();

    service = module.get<TipoPlanningService>(TipoPlanningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
