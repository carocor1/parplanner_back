import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { ProponerParticionDto } from './dto/proponer-particion.dto';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastosRepository: Repository<Gasto>,

    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,

    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createGastoDto: CreateGastoDto, userId: number) {
    const categoria = await this.categoriasRepository.findOneBy({
      nombre: createGastoDto.categoria,
    });
    if (!categoria) {
      throw new BadRequestException('Categoria no encontrada');
    }
    const usuario_creador = await this.usuariosRepository.findOneBy({
      id: userId,
    });
    if (!usuario_creador) {
      throw new BadRequestException('Usuario creador no encontrado');
    }
    const usuario_participe = await this.usuariosRepository.findOneBy({
      id: createGastoDto.usuario_participe,
    });
    if (!usuario_participe) {
      throw new BadRequestException('Usuario partícipe no encontrada');
    }
    const gasto = this.gastosRepository.create({
      ...createGastoDto,
      categoria,
      estado: { id: 1 },
      usuario_creador,
      usuario_participe,
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
    const progenitor1 = await this.usuariosRepository.findOneBy({ id: userId });
    const hijoEnComun = progenitor1.hijo;
    const progenitor2 = await this.usuariosRepository.findOneBy({
      hijo: hijoEnComun,
    });
    const gastos = await this.gastosRepository.find({
      where: {
        usuario_creador: progenitor1,
        usuario_participe: progenitor2,
      },
    });
  }
}
