import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PropuestasParticionService } from './propuestas_particion.service';
import { GastosService } from '../gastos/gastos.service';
import { MailService } from '../mail/mail.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PropuestasParticion } from './entities/propuestas_particion.entity';
import { Gasto } from '../gastos/entities/gasto.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { Hijo } from '../hijos/entities/hijo.entity';

describe('PropuestasParticionService (integration)', () => {
  let app: INestApplication;
  let gastosService: GastosService;
  let authService: AuthService;
  let mailService: MailService;
  let propuestasParticionRepository: Repository<PropuestasParticion>;
  let gastosRepository: Repository<Gasto>;
  let usuariosRepository: Repository<Usuario>;
  let hijosRepository: Repository<Hijo>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    gastosService = moduleFixture.get<GastosService>(GastosService);
    mailService = moduleFixture.get<MailService>(MailService);
    propuestasParticionRepository = moduleFixture.get<
      Repository<PropuestasParticion>
    >(getRepositoryToken(PropuestasParticion));
    gastosRepository = moduleFixture.get<Repository<Gasto>>(
      getRepositoryToken(Gasto),
    );
    hijosRepository = moduleFixture.get<Repository<Hijo>>(
      getRepositoryToken(Hijo),
    );
    usuariosRepository = moduleFixture.get<Repository<Usuario>>(
      getRepositoryToken(Usuario),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('rechazar', () => {
    it('Debería rechazar una propuesta de partición, actualizar el estado del gasto y enviar un correo electrónico', async () => {
      const usuarioCreador = new Usuario();
      usuarioCreador.nombre = 'Usuario';
      usuarioCreador.apellido = 'Creador';
      usuarioCreador.email = 'creador@example.com';
      usuarioCreador.contraseña = 'test';
      await usuariosRepository.save(usuarioCreador);

      const usuarioParticipe = new Usuario();
      usuarioParticipe.nombre = 'Usuario';
      usuarioParticipe.apellido = 'Participe';
      usuarioParticipe.email = 'participe@example.com';
      usuarioCreador.contraseña = 'test';
      await usuariosRepository.save(usuarioParticipe);
      const tokens = await authService.generateTokens(usuarioParticipe);

      const hijoEnComun = new Hijo();
      hijoEnComun.nombre = 'Test Hijo';
      hijoEnComun.apellido = 'Test Apellido';
      hijoEnComun.fecha_nacimiento = new Date();
      hijoEnComun.provincia = 'Test Provincia';
      hijoEnComun.ciudad = 'Test Ciudad';
      hijoEnComun.documento = 12345678;
      hijoEnComun.sexo = 'Masculino';
      hijoEnComun.progenitores = [usuarioCreador, usuarioParticipe];
      await hijosRepository.save(hijoEnComun);

      const createGastoDto = {
        titulo: 'Test Gasto',
        descripcion: 'Test Description',
        monto: 100,
        fecha: new Date(),
        categoria: 'Escolar',
        particion_usuario_creador: 50,
        particion_usuario_participe: 50,
      };

      const gasto = await gastosService.create(
        createGastoDto,
        usuarioCreador.id,
      );
      const propuesta = gasto.propuestas_particion[0];

      const createPropuestasParticionDto = {
        particion_usuario_creador_gasto: 50,
        particion_usuario_participe_gasto: 50,
      };

      jest
        .spyOn(mailService, 'enviarNotificaciónRechazoParticion')
        .mockResolvedValue();
      await request(app.getHttpServer())
        .post(`/propuestas-particion/rechazar/${propuesta.id}`)
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .send(createPropuestasParticionDto)
        .expect(201);
      const updatedPropuesta = await propuestasParticionRepository.findOne({
        where: { id: propuesta.id },
      });
      expect(updatedPropuesta.estado.id).toBe(6); // Rechazada
      const updatedGasto = await gastosRepository.findOne({
        where: { id: gasto.id },
      });
      expect(updatedGasto.estado.id).toBe(1); // Estado Negociando
      expect(
        mailService.enviarNotificaciónRechazoParticion,
      ).toHaveBeenCalledWith(
        usuarioParticipe.nombre,
        usuarioCreador.email,
        gasto.titulo,
      );
    });
  });

  describe('aprobar', () => {
    it('Debería aprobar una propuesta de partición, actualizar el estado del gasto y enviar un correo electrónico', async () => {
      const usuarioCreador = new Usuario();
      usuarioCreador.nombre = 'Usuario';
      usuarioCreador.apellido = 'Creador';
      usuarioCreador.email = 'creador@example.com';
      usuarioCreador.contraseña = 'test';
      await usuariosRepository.save(usuarioCreador);

      const usuarioParticipe = new Usuario();
      usuarioParticipe.nombre = 'Usuario';
      usuarioParticipe.apellido = 'Participe';
      usuarioParticipe.email = 'participe@example.com';
      usuarioCreador.contraseña = 'test';
      await usuariosRepository.save(usuarioParticipe);

      const tokens = await authService.generateTokens(usuarioParticipe);

      const hijoEnComun = new Hijo();
      hijoEnComun.nombre = 'Test Hijo';
      hijoEnComun.apellido = 'Test Apellido';
      hijoEnComun.fecha_nacimiento = new Date();
      hijoEnComun.provincia = 'Test Provincia';
      hijoEnComun.ciudad = 'Test Ciudad';
      hijoEnComun.documento = 12345678;
      hijoEnComun.sexo = 'Masculino';
      hijoEnComun.progenitores = [usuarioCreador, usuarioParticipe];
      await hijosRepository.save(hijoEnComun);

      const createGastoDto = {
        titulo: 'Test Gasto',
        descripcion: 'Test Description',
        monto: 100,
        fecha: new Date(),
        categoria: 'Escolar',
        particion_usuario_creador: 50,
        particion_usuario_participe: 50,
      };

      const gasto = await gastosService.create(
        createGastoDto,
        usuarioCreador.id,
      );
      const propuesta = gasto.propuestas_particion[0];

      jest
        .spyOn(mailService, 'enviarNotificaciónAprobacionParticion')
        .mockResolvedValue();

      await request(app.getHttpServer())
        .get(`/propuestas-particion/aprobar/${propuesta.id}`)
        .set('Authorization', `Bearer ${tokens.access_token}`)
        .expect(200);

      const updatedPropuesta = await propuestasParticionRepository.findOne({
        where: { id: propuesta.id },
      });
      expect(updatedPropuesta.estado.id).toBe(5); // Aprobada

      const updatedGasto = await gastosRepository.findOne({
        where: { id: gasto.id },
      });
      expect(updatedGasto.estado.id).toBe(3); // Pendiente

      expect(
        mailService.enviarNotificaciónAprobacionParticion,
      ).toHaveBeenCalledWith(
        usuarioParticipe.nombre,
        usuarioCreador.email,
        gasto.titulo,
      );
    });
  });
});
