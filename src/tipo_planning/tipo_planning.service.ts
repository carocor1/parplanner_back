import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTipoPlanningDto } from './dto/create-tipo_planning.dto';
import { UpdateTipoPlanningDto } from './dto/update-tipo_planning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoPlanning } from './entities/tipo_planning.entity';
import { Repository } from 'typeorm';
@Injectable()
export class TipoPlanningService {
  constructor(
    @InjectRepository(TipoPlanning)
    private readonly tipoPlanningRepository: Repository<TipoPlanning>,
  ) {}
  async create(createTipoPlanningDto: CreateTipoPlanningDto) {
    this.validarDistribucion(createTipoPlanningDto.distribucion);
    const tipoDePlanning = this.tipoPlanningRepository.create(
      createTipoPlanningDto,
    );
    return this.tipoPlanningRepository.save(tipoDePlanning);
  }

  async obtenerTipoPlanningPredeterminados() {
    return this.tipoPlanningRepository.find({
      where: { predeterminado: true },
    });
  }

  async findOne(id: number) {
    return this.tipoPlanningRepository.findOneBy({ id });
  }

  async update(id: number, updateTipoPlanningDto: UpdateTipoPlanningDto) {
    this.validarDistribucion(updateTipoPlanningDto.distribucion);
    return this.tipoPlanningRepository.update(id, updateTipoPlanningDto);
  }

  async remove(id: number) {
    return this.tipoPlanningRepository.softDelete(id);
  }

  private validarDistribucion(distribucion: number[]) {
    const suma = distribucion.reduce((a, b) => a + b, 0);
    if (suma != 14) {
      throw new BadRequestException(
        'La suma de la distribución debe ser igual a 14',
      );
    }
  }
}
