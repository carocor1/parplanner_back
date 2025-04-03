import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { HijosService } from 'src/hijos/hijos.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Repository } from 'typeorm';
import { Planning } from './entities/planning.entity';
import { TipoPlanning } from 'src/tipo_planning/entities/tipo_planning.entity';
import * as cron from 'node-cron';
import { Estado } from 'src/estados/entities/estado.entity';

@Injectable()
export class PlanningService {
  constructor(
    @InjectRepository(Planning)
    private readonly planningRepository: Repository<Planning>,

    @InjectRepository(TipoPlanning)
    private readonly tipoPlanningRepository: Repository<TipoPlanning>,

    private readonly hijosService: HijosService,

    private readonly usuariosService: UsuariosService,
  ) {
    cron.schedule('0 0 * * *', () => {
      this.agregarFechas();
    });
  }

  async create(createPlanningDto: CreatePlanningDto, userId: number) {
    //AGREGAR VERIFICACIÓN POR SI EL PLANNING FUE APROBADO PERO YA VENCIO
    const ultimoPlanning = await this.obtenerUltimoPlanning(userId);
    if (ultimoPlanning) {
      if (ultimoPlanning.estado.id === 7) {
        throw new BadRequestException('Ya existe un planning pendiente');
      }
      if (ultimoPlanning.estado.id === 8) {
        throw new BadRequestException('Ya existe un planning aprobado');
      }
    }
    const tipoPlanning = await this.tipoPlanningRepository.findOneBy({
      id: createPlanningDto.tipoPlanningId,
    });
    if (!tipoPlanning) {
      throw new NotFoundException('Tipo Planning no encontrado');
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
      (progenitor) => progenitor.id != usuario_creador.id,
    );
    if (!progenitor_participe) {
      throw new NotFoundException('Progenitor partícipe no encontrado');
    }
    const { fechaInicio } = createPlanningDto;
    const distribucionDias = tipoPlanning.distribucion;

    const fechasCreador = this.calcularFechasDistribucion(
      createPlanningDto.fechaInicio,
      distribucionDias,
      730,
      true,
    );

    const fechasParticipe = this.calcularFechasDistribucion(
      fechaInicio,
      distribucionDias,
      730,
      false,
    );

    const planning = this.planningRepository.create({
      fechaInicio,
      fechaCreacion: new Date(),
      tipoPlanning,
      estado: { id: 7 },
      usuario_creador,
      usuario_participe: progenitor_participe,
      fechasAsignadasCreador: fechasCreador.map((f) => f.fecha),
      fechasAsignadasParticipe: fechasParticipe.map((f) => f.fecha),
    });

    return await this.planningRepository.save(planning);
  }

  async previsualizarPlanning(
    createPlanningDto: CreatePlanningDto,
    userId: number,
  ) {
    const tipoPlanning = await this.tipoPlanningRepository.findOneBy({
      id: createPlanningDto.tipoPlanningId,
    });
    if (!tipoPlanning) {
      throw new NotFoundException('Tipo Planning no encontrado');
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
      (progenitor) => progenitor.id != usuario_creador.id,
    );
    if (!progenitor_participe) {
      throw new NotFoundException('Progenitor partícipe no encontrado');
    }
    const { fechaInicio } = createPlanningDto;
    const distribucionDias = tipoPlanning.distribucion;

    const fechasCreador = this.calcularFechasDistribucion(
      createPlanningDto.fechaInicio,
      distribucionDias,
      730,
      true,
    );

    const fechasParticipe = this.calcularFechasDistribucion(
      fechaInicio,
      distribucionDias,
      730,
      false,
    );
    return {
      fechasAsignadasCreador: fechasCreador.map((f) => f.fecha),
      fechasAsignadasParticipe: fechasParticipe.map((f) => f.fecha),
    };
  }

  private calcularFechasDistribucion(
    fechaInicio: Date,
    distribucionDias: number[],
    diasTotales: number,
    esUsuarioCreador: boolean,
  ): { fecha: string }[] {
    const fechasAsignadas: { fecha: string }[] = [];
    let fechaActual = new Date(fechaInicio);
    let diasRestantes = diasTotales;

    while (diasRestantes > 0) {
      distribucionDias.forEach((dias, index) => {
        const asignarCreador = (index % 2 === 0) === esUsuarioCreador;

        for (let i = 0; i < dias && diasRestantes > 0; i++) {
          if (asignarCreador) {
            fechasAsignadas.push({
              fecha: fechaActual.toISOString().split('T')[0],
            });
          }
          fechaActual.setDate(fechaActual.getDate() + 1);
          diasRestantes--;
        }
      });
    }

    return fechasAsignadas;
  }

  private async agregarFechas() {
    const plannings = await this.planningRepository.find();
    for (const planning of plannings) {
      const distribucionDias = planning.tipoPlanning.distribucion;

      const nuevasFechasCreador = this.calcularFechasDistribucion(
        new Date(),
        distribucionDias,
        730,
        true,
      );
      const nuevasFechasParticipe = this.calcularFechasDistribucion(
        new Date(),
        distribucionDias,
        730,
        false,
      );

      planning.fechasAsignadasCreador.push(
        ...nuevasFechasCreador.map((f) => f.fecha),
      );
      planning.fechasAsignadasParticipe.push(
        ...nuevasFechasParticipe.map((f) => f.fecha),
      );

      await this.planningRepository.save(planning);
    }
  }

  async findAll() {
    return await this.planningRepository.find();
  }

  async findOne(id: number) {
    const planningEspecifico = await this.planningRepository.findOne({
      where: { id },
    });
    if (!planningEspecifico) {
      throw new BadRequestException('Planning no encontrado');
    }
    return planningEspecifico;
  }

  async update(id: number, updatePlanningDto: UpdatePlanningDto) {
    const planningExistente = await this.planningRepository.findOne({
      where: { id },
    });

    if (!planningExistente) {
      throw new NotFoundException('Planning no encontrado');
    }

    const tipoPlanningExistente = await this.tipoPlanningRepository.findOneBy({
      id: updatePlanningDto.tipoPlanningId,
    });

    if (!tipoPlanningExistente) {
      throw new NotFoundException('Tipo de Planning no encontrado');
    }

    const usuario_creador = planningExistente.usuario_creador;
    const progenitor_participe = planningExistente.usuario_participe;

    if (!usuario_creador || !progenitor_participe) {
      throw new NotFoundException('Usuarios relacionados no encontrados');
    }

    const { fechaInicio } = updatePlanningDto;
    const distribucionDias = tipoPlanningExistente.distribucion;

    const nuevasFechasCreador = this.calcularFechasDistribucion(
      new Date(fechaInicio),
      distribucionDias,
      730,
      true,
    );
    const nuevasFechasParticipe = this.calcularFechasDistribucion(
      new Date(fechaInicio),
      distribucionDias,
      730,
      false,
    );

    planningExistente.fechaInicio = new Date(fechaInicio);
    planningExistente.tipoPlanning = tipoPlanningExistente;
    planningExistente.estado = { id: 7 } as Estado;

    planningExistente.fechasAsignadasCreador = nuevasFechasCreador.map(
      (f) => f.fecha,
    );
    planningExistente.fechasAsignadasParticipe = nuevasFechasParticipe.map(
      (f) => f.fecha,
    );

    const planningActualizado =
      await this.planningRepository.save(planningExistente);

    return planningActualizado;
  }

  async remove(id: number) {
    return await this.planningRepository.softDelete(id);
  }

  async obtenerUltimoPlanning(userId: number) {
    const progenitor1 = await this.usuariosService.findOne(userId);
    const hijoEnComun = await this.hijosService.findOne(progenitor1.hijo.id);

    if (!hijoEnComun.progenitores || hijoEnComun.progenitores.length < 2) {
      throw new NotFoundException(
        'Progenitores no encontrados o falta vincular correctamente',
      );
    }
    const planning = await this.planningRepository.findOne({
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
      order: { fechaCreacion: 'DESC' },
    });

    return planning || null;
  }

  async aprobarPlanning(id: number) {
    const planningABuscar = await this.findOne(id);
    if (planningABuscar.estado.id !== 7) {
      throw new BadRequestException('Tu planning no se encuentra pendiente ');
    }
    await this.planningRepository.update(id, {
      ...planningABuscar,
      estado: { id: 8 },
    });
  }
  async rechazarPlanning(
    id: number,
    userId: number,
    createPlanningDto: CreatePlanningDto,
  ) {
    const planningARechazar = await this.findOne(id);
    if (planningARechazar.estado.id != 7) {
      throw new BadRequestException(
        'El Planning no se encuentra en estado pendiente',
      );
    }
    await this.planningRepository.update(id, {
      ...planningARechazar,
      estado: { id: 9 },
    });
    return await this.create(createPlanningDto, userId);
  }
}
