import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlanningService } from './planning.service';
import { Planning } from './entities/planning.entity';
import { TipoPlanning } from '../tipo_planning/entities/tipo_planning.entity';
import { HijosService } from '../hijos/hijos.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { BadRequestException } from '@nestjs/common';

describe('PlanningService', () => {
  let service: PlanningService;
  let planningRepository: any;
  let tipoPlanningRepository: any;
  let hijosService: any;
  let usuariosService: any;

  beforeEach(async () => {
    planningRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    tipoPlanningRepository = {
      findOneBy: jest.fn(),
    };

    hijosService = {
      findOne: jest.fn(),
    };

    usuariosService = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanningService,
        {
          provide: getRepositoryToken(Planning),
          useValue: planningRepository,
        },
        {
          provide: getRepositoryToken(TipoPlanning),
          useValue: tipoPlanningRepository,
        },
        {
          provide: HijosService,
          useValue: hijosService,
        },
        {
          provide: UsuariosService,
          useValue: usuariosService,
        },
      ],
    }).compile();

    service = module.get<PlanningService>(PlanningService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('Debería lanzar BadRequestException si no se encuentra el Planning.', async () => {
      planningRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(BadRequestException);
    });

    it('Debería retornar un Planning si es encontrado.', async () => {
      const planning = { id: 1 };
      planningRepository.findOne.mockResolvedValue(planning);

      const result = await service.findOne(1);
      expect(result).toEqual(planning);
    });
  });
});
