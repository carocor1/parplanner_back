import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventosService } from './eventos.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { HijosService } from '../hijos/hijos.service';
import { Evento } from './entities/evento.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('EventosService', () => {
  let service: EventosService;
  let eventoRepository: Repository<Evento>;
  let usuariosService: UsuariosService;
  let hijosService: HijosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventosService,
        {
          provide: getRepositoryToken(Evento),
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
      ],
    }).compile();

    service = module.get<EventosService>(EventosService);
    eventoRepository = module.get<Repository<Evento>>(
      getRepositoryToken(Evento),
    );
    usuariosService = module.get<UsuariosService>(UsuariosService);
    hijosService = module.get<HijosService>(HijosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('Debería lanzar NotFoundException si el evento no existe.', async () => {
      jest.spyOn(eventoRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });

    it('Debería retornar el evento si existe.', async () => {
      const evento = { id: 1 };
      jest.spyOn(eventoRepository, 'findOne').mockResolvedValue(evento as any);

      const result = await service.findOne(1);

      expect(result).toEqual(evento);
    });
  });

  describe('update', () => {
    it('Debería actualizar el evento.', async () => {
      const evento = { id: 1 };
      jest.spyOn(service, 'findOne').mockResolvedValue(evento as any);
      jest.spyOn(eventoRepository, 'update').mockResolvedValue(null);

      const updateEventoDto = { nombre: 'Evento Actualizado' };
      const result = await service.update(1, updateEventoDto);

      expect(eventoRepository.update).toHaveBeenCalledWith(1, updateEventoDto);
    });
  });

  describe('remove', () => {
    it('Debería eliminar un evento.', async () => {
      jest.spyOn(eventoRepository, 'softDelete').mockResolvedValue(null);

      const result = await service.remove(1);

      expect(eventoRepository.softDelete).toHaveBeenCalledWith(1);
    });
  });
});
