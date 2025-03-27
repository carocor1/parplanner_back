import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
  CanActivate,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Evento } from 'src/eventos/entities/evento.entity';

import { EventosService } from 'src/eventos/eventos.service';

@Injectable()
export class EsCreadorGuardEvento implements CanActivate {
  constructor(private eventosService: EventosService) {}
    
  
  async canActivate(context: ExecutionContext): Promise<boolean>  {

        const request= context.switchToHttp().getRequest(); 
        const user= request.user
        const eventoId= request.params.id; 

        const evento: Evento= await this.eventosService.findOne(eventoId)

        if (evento.usuario_creador.id!==user.userId){
            throw new ForbiddenException("No se tiene permiso para modificar el gasto")
        };

        return true; 
       
    }
    
   

  
   
}
