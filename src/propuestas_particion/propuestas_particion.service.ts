import { Inject, Injectable } from '@nestjs/common';
import { CreatePropuestasParticionDto } from './dto/create-propuestas_particion.dto';
import { UpdatePropuestasParticionDto } from './dto/update-propuestas_particion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PropuestasParticion } from './entities/propuestas_particion.entity';
import { Repository } from 'typeorm';
import { GastosService } from 'src/gastos/gastos.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { EstadosService } from 'src/estados/estados.service';

@Injectable()
export class PropuestasParticionService {
  constructor(
    @InjectRepository(PropuestasParticion)
    private readonly propuestasParticionRepository: Repository<PropuestasParticion>,

    private readonly gastosService: GastosService,

    private readonly usuariosService: UsuariosService,
  ) {}

  async create(
    createPropuestasParticionDto: CreatePropuestasParticionDto,
    gastoId: number,
    usuarioCreadorId: number,
  ) {
    try {
      const gasto = await this.gastosService.findOne(gastoId);
      const usuario_creador =
        await this.usuariosService.findOne(usuarioCreadorId);
      const propuestasParticion = this.propuestasParticionRepository.create({
        ...createPropuestasParticionDto,
        gasto,
        usuario_creador,
        estado: { id: 4 },
      });
      console.log(propuestasParticion);
      return await this.propuestasParticionRepository.save(propuestasParticion);
    } catch (error) {
      throw new Error('Error al crear la propuesta de particion');
    }
  }

  findAll() {
    return `This action returns all propuestasParticion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} propuestasParticion`;
  }

  update(
    id: number,
    updatePropuestasParticionDto: UpdatePropuestasParticionDto,
  ) {
    return `This action updates a #${id} propuestasParticion`;
  }

  remove(id: number) {
    return `This action removes a #${id} propuestasParticion`;
  }
}
