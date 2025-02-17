import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { ProponerParticionDto } from './dto/proponer-particion.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { HijosService } from 'src/hijos/hijos.service';
import { PropuestasParticionService } from 'src/propuestas_particion/propuestas_particion.service';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastosRepository: Repository<Gasto>,

    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,

    private readonly hijosService: HijosService,

    private readonly usuariosService: UsuariosService,

    @Inject(forwardRef(() => PropuestasParticionService))
    private readonly propuestasParticionService: PropuestasParticionService,
  ) {}

  async create(createGastoDto: CreateGastoDto, userId: number) {
    const categoria = await this.categoriasRepository.findOneBy({
      nombre: createGastoDto.categoria,
    });
    if (!categoria) {
      throw new BadRequestException('Categoria no encontrada');
    }
    const usuario_creador = await this.usuariosService.findOne(userId);
    const hijoEnComun = await this.hijosService.findOne(
      usuario_creador.hijo.id,
    );
    if (!hijoEnComun.progenitores || hijoEnComun.progenitores.length < 2) {
      throw new NotFoundException(
        'Progenitores no encontrados o falta vincular correctamente',
      );
    }
    const progenitor_participe = hijoEnComun.progenitores.find(
      (progenitor) => progenitor.id !== usuario_creador.id,
    );
    if (!progenitor_participe) {
      throw new NotFoundException('Progenitor partícipe no encontrado');
    }
    const {
      titulo,
      descripcion,
      monto,
      fecha,
      particion_usuario_creador,
      particion_usuario_participe,
    } = createGastoDto;

    const gasto = this.gastosRepository.create({
      titulo,
      descripcion,
      monto,
      fecha,
      categoria,
      estado: { id: 1 },
      usuario_creador,
      particion_usuario_creador, //a eliminar
      particion_usuario_participe, //a eliminar
      usuario_participe: progenitor_participe,
      propuestas_particion: [],
    });

    const gastoCreado = await this.gastosRepository.save(gasto);

    await this.propuestasParticionService.create(
      {
        particion_usuario_creador_gasto: particion_usuario_creador,
        particion_usuario_participe_gasto: particion_usuario_participe,
      },
      gastoCreado.id,
      userId,
    );
    const gastoConRelacion = await this.findOne(gastoCreado.id);
    return gastoConRelacion;
  }

  async findAll() {
    return await this.gastosRepository.find();
  }

  async findOne(id: number) {
    const gasto = await this.gastosRepository.findOne({
      where: { id },
      relations: ['propuestas_particion'],
    });
    if (!gasto) {
      throw new BadRequestException('Gasto no encontrado');
    }
    return gasto;
  }

  //A eliminar en DTO particion_usuario_creador y particion_usuario_participe
  async update(id: number, updateGastoDto: UpdateGastoDto) {
    await this.findOne(id);
    let categoria: Categoria;
    if (updateGastoDto.categoria) {
      categoria = await this.categoriasRepository.findOneBy({
        nombre: updateGastoDto.categoria,
      });
      if (!categoria) {
        throw new BadRequestException('Categoria no encontrada');
      }
    }
    return await this.gastosRepository.update(id, {
      ...updateGastoDto,
      categoria,
    });
  }

  async remove(id: number) {
    return await this.gastosRepository.softDelete(id);
  }

  //A ELIMINAR
  async proponerParticion(
    id: number,
    proponerParticionDto: ProponerParticionDto,
  ) {
    await this.findOne(id);
    const { particion_usuario_creador, particion_usuario_participe } =
      proponerParticionDto;
    return await this.gastosRepository.update(id, {
      particion_usuario_creador,
      particion_usuario_participe,
    });
  }

  async aceptarParticion(gasto: Gasto) {
    return await this.gastosRepository.update(gasto.id, {
      estado: { id: 3 },
    });
  }

  async listarGastosCompartidos(userId: number) {
    const progenitor1 = await this.usuariosService.findOne(userId);
    const hijoEnComun = await this.hijosService.findOne(progenitor1.hijo.id);

    if (!hijoEnComun.progenitores || hijoEnComun.progenitores.length < 2) {
      throw new NotFoundException(
        'Progenitores no encontrados o falta vincular correctamente',
      );
    }

    const gastos = await this.gastosRepository.find({
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
    });

    return gastos;
  }
}
