import { Injectable } from '@nestjs/common';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Estado } from './entities/estado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstadosService {
  constructor(
    @InjectRepository(Estado)
    private readonly estadosRepository: Repository<Estado>,
  ) {}
  async create(createEstadoDto: CreateEstadoDto) {
    const estado = this.estadosRepository.create(createEstadoDto);
    return await this.estadosRepository.save(estado);
  }

  async findAll() {
    return await this.estadosRepository.find();
  }

  async findOne(id: number) {
    return await this.estadosRepository.findOneBy({ id });
  }

  async update(id: number, updateEstadoDto: UpdateEstadoDto) {
    return await this.estadosRepository.update(id, updateEstadoDto);
  }

  async remove(id: number) {
    return await this.estadosRepository.softDelete(id);
  }
}
