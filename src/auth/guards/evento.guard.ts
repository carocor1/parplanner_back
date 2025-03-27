import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { EventosService } from 'src/eventos/eventos.service';

@Injectable()

export class EventosGuard implements CanActivate{
    constructor(

        private readonly eventosService:EventosService, 
        private readonly reflector: Reflector
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {

        const request= context.switchToHttp().getRequest(); 
        const user= request.user; 
        const eventoId= request.params.id; 
        

        if (!user || !eventoId) {
            throw new BadRequestException();
        }; 

        const evento= await this.eventosService.findOne(eventoId)

        if (!evento){
            throw new NotFoundException ("Evento no encontrado"); 
        }
    
        if (evento.usuario_creador.id==user.userId || evento.usuario_participe.id==user.userId){
            return true;
        }

        throw new UnauthorizedException(
            'No tienes permiso para acceder a este evento',
        );

    }
}