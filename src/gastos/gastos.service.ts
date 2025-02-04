import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { Repository } from 'typeorm';
import { Categoria } from 'src/categorias/entities/categoria.entity';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastosRepository: Repository<Gasto>,

    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
  ) {}

  async create(createGastoDto: CreateGastoDto) {
    const categoria = await this.categoriasRepository.findOneBy({
      nombre: createGastoDto.categoria,
    });
    if (!categoria) {
      throw new BadRequestException('Categoria no encontrada');
    }
    const gasto = this.gastosRepository.create({
      ...createGastoDto,
      categoria,
      estado: { id: 1 }, //pendiente
    });
    return await this.gastosRepository.save(gasto);
  }

  async findAll() {
    return await this.gastosRepository.find();
  }

  async findOne(id: number) {
    return await this.gastosRepository.findOneBy({ id });
  }

  async update(id: number, updateGastoDto: UpdateGastoDto) {
    const gasto = await this.gastosRepository.findOneBy({ id });
    if (!gasto) {
      throw new BadRequestException('Gasto no encontrado');
    }
    let categoria;
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
}
