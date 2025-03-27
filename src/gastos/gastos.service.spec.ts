import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GastosService } from './gastos.service';
import { Gasto } from './entities/gasto.entity';
import { Categoria } from '../categorias/entities/categoria.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { HijosService } from '../hijos/hijos.service';
import { PropuestasParticionService } from '../propuestas_particion/propuestas_particion.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('GastosService', () => {
  let service: GastosService;
  let gastosRepository: Repository<Gasto>;
  let categoriasRepository: Repository<Categoria>;
  let usuariosService: UsuariosService;
  let hijosService: HijosService;
  let propuestasParticionService: PropuestasParticionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GastosService,
        {
          provide: getRepositoryToken(Gasto),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Categoria),
          useClass: Repository,
        },
        {
          provide: UsuariosService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: HijosService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: PropuestasParticionService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GastosService>(GastosService);
    gastosRepository = module.get<Repository<Gasto>>(getRepositoryToken(Gasto));
    categoriasRepository = module.get<Repository<Categoria>>(
      getRepositoryToken(Categoria),
    );
    usuariosService = module.get<UsuariosService>(UsuariosService);
    hijosService = module.get<HijosService>(HijosService);
    propuestasParticionService = module.get<PropuestasParticionService>(
      PropuestasParticionService,
    );
  });

  describe('create', () => {
    it('should throw BadRequestException if categoria is not found', async () => {
      const createGastoDto = {
        titulo: 'Test Gasto',
        descripcion: 'Test Description',
        monto: 100,
        fecha: new Date(),
        categoria: 'Test Categoria',
        particion_usuario_creador: 50,
        particion_usuario_participe: 50,
      };
      const userId = 1;

      jest.spyOn(categoriasRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.create(createGastoDto as any, userId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if progenitores are not found', async () => {
      const createGastoDto = {
        titulo: 'Test Gasto',
        descripcion: 'Test Description',
        monto: 100,
        fecha: new Date(),
        categoria: 'Test Categoria',
        particion_usuario_creador: 50,
        particion_usuario_participe: 50,
      };
      const userId = 1;
      const categoria = new Categoria();
      const usuario_creador = { id: 1, hijo: { id: 1 } };
      const hijoEnComun = { progenitores: [] };

      jest
        .spyOn(categoriasRepository, 'findOneBy')
        .mockResolvedValue(categoria);
      jest
        .spyOn(usuariosService, 'findOne')
        .mockResolvedValue(usuario_creador as any);
      jest.spyOn(hijosService, 'findOne').mockResolvedValue(hijoEnComun as any);

      await expect(
        service.create(createGastoDto as any, userId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('pagarGastos', () => {
    it('should update gasto estado to 2 if estado is 3', async () => {
      const gasto = { id: 1, estado: { id: 3 } };
      jest.spyOn(service, 'findOne').mockResolvedValue(gasto as any);
      jest.spyOn(gastosRepository, 'update').mockResolvedValue(null);

      await service.pagarGastos(1);

      expect(gastosRepository.update).toHaveBeenCalledWith(1, {
        estado: { id: 2 },
      });
    });

    it('should throw BadRequestException if gasto estado is not 3', async () => {
      const gasto = { id: 1, estado: { id: 1 } };
      jest.spyOn(service, 'findOne').mockResolvedValue(gasto as any);

      await expect(service.pagarGastos(1)).rejects.toThrow(BadRequestException);
    });
  });

  describe('listarGastosCompartidos', () => {
    it('should return shared gastos', async () => {
      const userId = 1;
      const progenitor1 = { id: 1, hijo: { id: 1 } };
      const hijoEnComun = { progenitores: [{ id: 1 }, { id: 2 }] };
      const gastos = [{ id: 1 }, { id: 2 }];

      jest
        .spyOn(usuariosService, 'findOne')
        .mockResolvedValue(progenitor1 as any);
      jest.spyOn(hijosService, 'findOne').mockResolvedValue(hijoEnComun as any);
      jest.spyOn(gastosRepository, 'find').mockResolvedValue(gastos as any);

      const result = await service.listarGastosCompartidos(userId);

      expect(result).toEqual(gastos);
      expect(usuariosService.findOne).toHaveBeenCalledWith(userId);
      expect(hijosService.findOne).toHaveBeenCalledWith(progenitor1.hijo.id);
      expect(gastosRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: [
            {
              usuario_creador: hijoEnComun.progenitores[0],
              usuario_participe: hijoEnComun.progenitores[1],
            },
            {
              usuario_creador: hijoEnComun.progenitores[1],
              usuario_participe: hijoEnComun.progenitores[0],
            },
          ],
          order: {
            fecha: 'DESC',
          },
        }),
      );
    });

    it('should throw NotFoundException if progenitores are not found', async () => {
      const userId = 1;
      const progenitor1 = { id: 1, hijo: { id: 1 } };
      const hijoEnComun = { progenitores: [] };

      jest
        .spyOn(usuariosService, 'findOne')
        .mockResolvedValue(progenitor1 as any);
      jest.spyOn(hijosService, 'findOne').mockResolvedValue(hijoEnComun as any);

      await expect(service.listarGastosCompartidos(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
