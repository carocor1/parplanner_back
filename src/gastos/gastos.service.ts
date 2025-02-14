import {
  BadRequestException,
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

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastosRepository: Repository<Gasto>,

    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,

    private readonly hijosService: HijosService,

    private readonly usuariosService: UsuariosService,
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

    const gasto = this.gastosRepository.create({
      ...createGastoDto,
      categoria,
      estado: { id: 1 },
      usuario_creador,
      usuario_participe: progenitor_participe,
    });

    return await this.gastosRepository.save(gasto);
  }

  async findAll() {
    return await this.gastosRepository.find();
  }

  async findOne(id: number) {
    const gasto = await this.gastosRepository.findOneBy({ id });
    if (!gasto) {
      throw new BadRequestException('Gasto no encontrado');
    }
    return gasto;
  }

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
