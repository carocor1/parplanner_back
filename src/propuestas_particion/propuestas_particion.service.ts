import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropuestasParticionDto } from './dto/create-propuestas_particion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PropuestasParticion } from './entities/propuestas_particion.entity';
import { Repository } from 'typeorm';
import { GastosService } from '../gastos/gastos.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { Gasto } from '../gastos/entities/gasto.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PropuestasParticionService {
  constructor(
    @InjectRepository(PropuestasParticion)
    private readonly propuestasParticionRepository: Repository<PropuestasParticion>,

    @InjectRepository(Gasto)
    private readonly gastosRepository: Repository<Gasto>,

    @Inject(forwardRef(() => GastosService))
    private readonly gastosService: GastosService,

    private readonly usuariosService: UsuariosService,

    private readonly mailService: MailService,
  ) {}

  async create(
    createPropuestasParticionDto: CreatePropuestasParticionDto,
    gastoId: number,
    usuarioCreadorId: number,
  ) {
    const gasto = await this.gastosService.findOne(gastoId);
    const propuestaPendienteOPagadaExistente = gasto.propuestas_particion.find(
      (propuesta) => propuesta.estado.id === 4 || propuesta.estado.id === 5,
    );
    if (propuestaPendienteOPagadaExistente) {
      throw new BadRequestException(
        'Ya existe una propuesta pendiente o aprobada para este gasto',
      );
    }
    const usuario_creador =
      await this.usuariosService.findOne(usuarioCreadorId);
    const propuestasParticion = this.propuestasParticionRepository.create({
      ...createPropuestasParticionDto,
      gasto,
      usuario_creador,
      estado: { id: 4 },
    });
    const propuestaGuardada =
      await this.propuestasParticionRepository.save(propuestasParticion);
    gasto.propuestas_particion.push(propuestasParticion);
    await this.gastosRepository.save(gasto);
    return propuestaGuardada;
  }

  async obtenerUltimaParticionPendienteOPagada(gastoId: number) {
    const gasto = await this.gastosService.findOne(gastoId);
    let propuestaParticion = await this.propuestasParticionRepository.findOne({
      where: { gasto, estado: { id: 4 } },
    });
    if (!propuestaParticion) {
      propuestaParticion = await this.propuestasParticionRepository.findOne({
        where: { gasto, estado: { id: 5 } },
      });
      if (!propuestaParticion) {
        throw new NotFoundException('No hay propuestas pendientes o pagadas');
      }
      return propuestaParticion;
    }
    return propuestaParticion;
  }

  async findOne(id: number) {
    const propuesta = await this.propuestasParticionRepository.findOne({
      where: { id },
      relations: ['gasto'],
    });
    if (!propuesta) {
      throw new NotFoundException('Propuesta de Particion no encontrada');
    }
    return propuesta;
  }

  async rechazar(
    idPropuesta: number,
    userId: number,
    createPropuestasParticionDto: CreatePropuestasParticionDto,
  ) {
    const usuario = await this.usuariosService.findOne(userId);
    const propuestasParticion = await this.findOne(idPropuesta);
    if (usuario.id == propuestasParticion.usuario_creador.id) {
      throw new BadRequestException('No puedes rechazar tu propuesta');
    }
    if (propuestasParticion.estado.id !== 4) {
      throw new BadRequestException(
        'El estado de la partición no es Pendiente',
      );
    }
    await this.verificarPropuestaAceptada(propuestasParticion.gasto.id);
    await this.propuestasParticionRepository.update(idPropuesta, {
      ...propuestasParticion,
      estado: { id: 6 },
    });
    const gasto = await this.gastosService.findOne(
      propuestasParticion.gasto.id,
    );
    this.mailService.enviarNotificaciónRechazoParticion(
      usuario.nombre,
      propuestasParticion.usuario_creador.email,
      gasto.titulo,
    );
    return await this.create(
      createPropuestasParticionDto,
      propuestasParticion.gasto.id,
      userId,
    );
  }

  async aprobar(id: number, userId: number) {
    const usuario = await this.usuariosService.findOne(userId);
    const propuestasParticion = await this.findOne(id);
    await this.verificarPropuestaAceptada(propuestasParticion.gasto.id);
    if (usuario.id == propuestasParticion.usuario_creador.id) {
      throw new BadRequestException('No puedes aprobar tu propuesta');
    }
    if (propuestasParticion.estado.id !== 4) {
      throw new BadRequestException(
        'El estado de la partición no es Pendiente',
      );
    }
    await this.propuestasParticionRepository.update(id, {
      ...propuestasParticion,
      estado: { id: 5 },
    });
    const gasto = await this.gastosService.findOne(
      propuestasParticion.gasto.id,
    );
    this.mailService.enviarNotificaciónAprobacionParticion(
      usuario.nombre,
      propuestasParticion.usuario_creador.email,
      gasto.titulo,
    );
    return await this.gastosService.aprobarParticion(gasto);
  }

  async verificarPropuestaAceptada(gastoId: number) {
    const gasto = await this.gastosService.findOne(gastoId);
    const propuestaAprobada = gasto.propuestas_particion.find(
      (propuesta) => propuesta.estado.id === 5,
    );
    if (propuestaAprobada) {
      throw new BadRequestException(
        'Ya existe una propuesta aprobada para este gasto',
      );
    }
  }
}
