import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriasRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto) {
    const categoria = this.categoriasRepository.create(createCategoriaDto);
    return await this.categoriasRepository.save(categoria);
  }

  async findAll() {
    return await this.categoriasRepository.find();
  }

  async findOne(id: number) {
    return await this.categoriasRepository.findOneBy({ id });
  }

  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return await this.categoriasRepository.update(id, updateCategoriaDto);
  }

  async remove(id: number) {
    return await this.categoriasRepository.softDelete(id);
  }
}
