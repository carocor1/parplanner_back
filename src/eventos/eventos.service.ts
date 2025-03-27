import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { HijosService } from 'src/hijos/hijos.service';
import { Evento } from './entities/evento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class EventosService {

  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository:Repository<Evento>,

    private readonly hijosService:HijosService, 
    
    private readonly usuariosService: UsuariosService,
    
  ){}
  async create(createEventoDto: CreateEventoDto, userId: number) {

    const usuario_creador = await this.usuariosService.findOne(userId);

    const hijoEnComun= await this.hijosService.findOne(usuario_creador.hijo.id);

    if (!hijoEnComun.progenitores || hijoEnComun.progenitores.length<2){
      throw new NotFoundException("Progenitores no encontrados o hijo no vinculado correctamente")
    }; 

    const progenitor_participe= hijoEnComun.progenitores.find((progenitor)=> progenitor.id!== usuario_creador.id) 

    if (!progenitor_participe){
      throw new NotFoundException ("Progenitor participe no encontrado")
    }

    const{
      nombre, 
      diaEvento, 
      horaInicio, 
      horaFin, 
      alarmaCreador, 

    }=createEventoDto;

    const evento= this.eventoRepository.create({
      nombre, 
      diaEvento, 
      horaInicio, 
      horaFin, 
      alarmaCreador, 
      estado: {id:12}, 
      usuario_creador, 
      usuario_participe:progenitor_participe
    });

    const eventoCreado= await this.eventoRepository.save(evento);

    return eventoCreado;
  }

  async findAll() {
    return await this.eventoRepository.find();
  }

  async findOne(id: number) {
    const eventoABuscar= await this.eventoRepository.findOne({where:{id}})

    if (!eventoABuscar){
      throw new NotFoundException("Evento con ese ID no encontrado")
    }
    return eventoABuscar;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto) {
    await this.findOne(id)
    return await this.eventoRepository.update(id, {...updateEventoDto});
  }

  async remove(id: number) {
    return await this.eventoRepository.softDelete(id);
  }

  async aceptarEvento(id:number, userId:number){

    const usuario= await this.usuariosService.findOne(userId); 
    const eventoAceptado= await this.findOne(id); 

    if (!eventoAceptado) {
      throw new NotFoundException("Evento no encontrado");
    }

    if( usuario.id==eventoAceptado.usuario_creador.id){
      throw new BadRequestException("No podes aceptar el evento que propusiste")
    }; 

    if (eventoAceptado.estado.id!==12){
      throw new BadRequestException("El evento no se encuentra en estado pendiente ")
    }
    await this.eventoRepository.update(id, { ...eventoAceptado, estado: { id: 13 } });

  }

  async rechazarEvento (id:number, userId:number, createEventoDto:CreateEventoDto){
    const usuario= await this.usuariosService.findOne(userId); 
    const eventoARechazar= await this.findOne(id);

    if (eventoARechazar.usuario_creador.id==usuario.id){
      throw new BadRequestException("No podes rechazar el evento que vos propones ")
    }

    if (eventoARechazar.estado.id!==12){
      throw new BadRequestException ("Tu evento no se encuentra pendiente de aprobación ")
    }

    await this.eventoRepository.update(id, {...eventoARechazar, estado: {id:14}});

    return await this.create(createEventoDto,userId);
  }

  async listarEventosCompartidos(userId:number){
    const progenitor1= await this.usuariosService.findOne(userId); 
    const hijoEnComun= await this.hijosService.findOne(progenitor1.hijo.id); 

    if (!hijoEnComun.progenitores || hijoEnComun.progenitores.length < 2) {
      throw new NotFoundException(
        'Progenitores no encontrados o falta vincular correctamente',
      );
    }

    const eventos= await this.eventoRepository.find({
      where: [
        {usuario_creador:hijoEnComun.progenitores[0],
          usuario_participe: hijoEnComun.progenitores[1]
        }, 
        {usuario_creador:hijoEnComun.progenitores[1],
          usuario_participe: hijoEnComun.progenitores[0]
        },

      ], 
      order:{
        diaEvento: 'ASC',
        horaInicio:'ASC'
      }

    }); 
    return eventos; 
  }


  

}
