import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcryptjs';
import { NotFoundException } from '@nestjs/common';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let usuariosRepository: Repository<Usuario>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    usuariosRepository = module.get<Repository<Usuario>>(
      getRepositoryToken(Usuario),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validatePassword', () => {
    it('Debería retornar true si las contraseñas coinciden.', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);
      const result = await service.validatePassword(
        'password',
        'hashedPassword',
      );
      expect(result).toBe(true);
    });

    it('Debería retornar false si las contraseñas NO coinciden.', async () => {
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
      const result = await service.validatePassword(
        'password',
        'hashedPassword',
      );
      expect(result).toBe(false);
    });
  });

  describe('hashPassword', () => {
    it('Debería retornar la contraseña hasheada.', async () => {
      const hashedPassword = 'hashedPassword';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      const result = await service.hashPassword('password');
      expect(result).toBe(hashedPassword);
    });
  });

  describe('UserExist', () => {
    it('Debería retornar true si el usuario existe.', async () => {
      jest
        .spyOn(usuariosRepository, 'findOne')
        .mockResolvedValue(new Usuario());
      const result = await service.UserExist('test@example.com');
      expect(result).toBe(true);
    });

    it('Debería retornar false si el usuario NO existe.', async () => {
      jest.spyOn(usuariosRepository, 'findOne').mockResolvedValue(null);
      const result = await service.UserExist('test@example.com');
      expect(result).toBe(false);
    });
  });

  describe('tieneHijo', () => {
    it('Debería retornar true si el usuario tiene un hijo asociado.', async () => {
      const usuario = new Usuario();
      usuario.hijo = {
        id: 1,
        nombre: 'Hijo',
        apellido: 'Apellido',
        fecha_nacimiento: new Date(),
        provincia: 'Provincia',
        ciudad: 'Ciudad',
        documento: 12345678,
        sexo: 'M',
        progenitores: [usuario, new Usuario()],
        codigoInvitacion: null,
        codigoExpiracion: null,
        fechaEliminacion: null,
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(usuario);
      const result = await service.tieneHijo(1);
      expect(result).toBe(true);
    });

    it('Debería retornar false si el usuario NO tiene un hijo asociado.', async () => {
      const usuario = new Usuario();
      usuario.hijo = null;
      jest.spyOn(service, 'findOne').mockResolvedValue(usuario);
      const result = await service.tieneHijo(1);
      expect(result).toBe(false);
    });
  });

  describe('verificarRegistro', () => {
    it('Debería retornar true si el registro del usuario está completo.', async () => {
      const usuario = new Usuario();
      usuario.fecha_nacimiento = new Date();
      usuario.provincia = 'Provincia';
      usuario.ciudad = 'Ciudad';
      usuario.documento = 12345678;
      usuario.sexo = 'M';
      usuario.cbu = '1234567890123456789012';
      usuario.nro_telefono = '123456789';
      jest.spyOn(service, 'findOne').mockResolvedValue(usuario);
      const result = await service.verificarRegistro(1);
      expect(result).toBe(true);
    });

    it('Debería retornar false si el registro del usuario NO está completo.', async () => {
      const usuario = new Usuario();
      usuario.fecha_nacimiento = null;
      jest.spyOn(service, 'findOne').mockResolvedValue(usuario);
      const result = await service.verificarRegistro(1);
      expect(result).toBe(false);
    });
  });

  describe('registrarUsuario', () => {
    it('Debería actualizar el registro del usuario.', async () => {
      const registroUsuarioDto: RegistroUsuarioDto = {
        fecha_nacimiento: new Date(),
        provincia: 'Provincia',
        ciudad: 'Ciudad',
        documento: 12345678,
        sexo: 'M',
        cbu: '1234567890123456789012',
        nro_telefono: '123456789',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(new Usuario());
      jest.spyOn(usuariosRepository, 'update').mockResolvedValue(null);
      await service.registrarUsuario(registroUsuarioDto, 1);
      expect(usuariosRepository.update).toHaveBeenCalledWith(
        1,
        registroUsuarioDto,
      );
    });
  });

  describe('findOne', () => {
    it('Debería retornar un usuario si es encontrado.', async () => {
      const usuario = new Usuario();
      jest.spyOn(usuariosRepository, 'findOne').mockResolvedValue(usuario);
      const result = await service.findOne(1);
      expect(result).toBe(usuario);
    });

    it('Debería lanzar un NotFoundException si el usuario no es encontrado.', async () => {
      jest.spyOn(usuariosRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('Debería actualizar los datos del usuario.', async () => {
      const updateUsuarioDto: UpdateUsuarioDto = {
        nombre: 'Updated Name',
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(new Usuario());
      jest.spyOn(usuariosRepository, 'update').mockResolvedValue(null);
      await service.update(1, updateUsuarioDto);
      expect(usuariosRepository.update).toHaveBeenCalledWith(
        1,
        updateUsuarioDto,
      );
    });
  });

  describe('cambiarContraseña', () => {
    it('Debería actualizar la contraseña de un usuario si su codigoRecuperación fue validado.', async () => {
      const usuario = new Usuario();
      usuario.codigoRecuperacion = 'VALIDADO';
      jest.spyOn(service, 'findOne').mockResolvedValue(usuario);
      jest.spyOn(service, 'hashPassword').mockResolvedValue('hashedPassword');
      jest.spyOn(usuariosRepository, 'update').mockResolvedValue(null);
      jest.spyOn(usuariosRepository, 'save').mockResolvedValue(usuario);
      await service.cambiarContraseña('newPassword', 1);
      expect(usuariosRepository.update).toHaveBeenCalledWith(1, {
        contraseña: 'hashedPassword',
      });
    });

    it('Debería lanzar un NotFoundException si el codigoRecuperación no fue validado.', async () => {
      const usuario = new Usuario();
      usuario.codigoRecuperacion = null;
      jest.spyOn(service, 'findOne').mockResolvedValue(usuario);
      await expect(service.cambiarContraseña('newPassword', 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
