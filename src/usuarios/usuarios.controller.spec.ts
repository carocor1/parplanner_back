import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { UnauthorizedException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: {
            registrarUsuario: jest.fn(),
            tieneHijo: jest.fn(),
            verificarRegistro: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registrarUsuario', () => {
    it('should register a user', async () => {
      const registroUsuarioDto: RegistroUsuarioDto = {
        nro_telefono: '123456789',
        provincia: 'Provincia',
        ciudad: 'Ciudad',
        fecha_nacimiento: new Date(),
        documento: 12345678,
        sexo: 'Masculino',
        cbu: '1234567890123456789012',
      };
      const req = { user: { userId: 1 } };
      jest
        .spyOn(service, 'registrarUsuario')
        .mockResolvedValue(new UpdateResult());
      const result = await controller.registrarUsuario(registroUsuarioDto, req);
      expect(result).toBe(new UpdateResult());
      expect(service.registrarUsuario).toHaveBeenCalledWith(
        registroUsuarioDto,
        req.user.userId,
      );
    });
  });

  describe('tieneHijos', () => {
    it('should return true if user has a child', async () => {
      const req = { user: { userId: 1 } };
      jest.spyOn(service, 'tieneHijo').mockResolvedValue(true);

      const result = await controller.tieneHijos(req);
      expect(result).toBe(true);
      expect(service.tieneHijo).toHaveBeenCalledWith(req.user.userId);
    });

    it('should return false if user does not have a child', async () => {
      const req = { user: { userId: 1 } };
      jest.spyOn(service, 'tieneHijo').mockResolvedValue(false);

      const result = await controller.tieneHijos(req);
      expect(result).toBe(false);
      expect(service.tieneHijo).toHaveBeenCalledWith(req.user.userId);
    });
  });

  describe('verificarRegistro', () => {
    it('should return true if user has completed registration', async () => {
      const req = { user: { userId: 1 } };
      jest.spyOn(service, 'verificarRegistro').mockResolvedValue(true);

      const result = await controller.verificarRegistro(req);
      expect(result).toBe(true);
      expect(service.verificarRegistro).toHaveBeenCalledWith(req.user.userId);
    });

    it('should return false if user has not completed registration', async () => {
      const req = { user: { userId: 1 } };
      jest.spyOn(service, 'verificarRegistro').mockResolvedValue(false);

      const result = await controller.verificarRegistro(req);
      expect(result).toBe(false);
      expect(service.verificarRegistro).toHaveBeenCalledWith(req.user.userId);
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const user = new Usuario();
      const req = { user: { userId: 1 } };
      jest.spyOn(service, 'findOne').mockResolvedValue(user);

      const result = await controller.findOne(1, req);
      expect(result).toBe(user);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException if user ID does not match', async () => {
      const req = { user: { userId: 2 } };

      await expect(controller.findOne(1, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const updateUsuarioDto: UpdateUsuarioDto = {
        email: 'test@example.com',
      };
      jest.spyOn(service, 'update').mockResolvedValue(new UpdateResult());

      const result = await controller.update(1, updateUsuarioDto);
      expect(result).toBe(new UpdateResult());
      expect(service.update).toHaveBeenCalledWith(1, updateUsuarioDto);
    });
  });
});
