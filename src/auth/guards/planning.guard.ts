import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PlanningService } from 'src/planning/planning.service';

@Injectable()

export class PlanningGuard implements CanActivate{
    constructor(

        private readonly planningService:PlanningService, 
        private readonly reflector: Reflector
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {

        const request= context.switchToHttp().getRequest(); 
        const user= request.user; 
        const planningId= request.params.id; 

        if (!user || !planningId) {
            throw new BadRequestException();
        }; 

        const planning= await this.planningService.findOne(planningId)

        if (!planning){
            throw new NotFoundException ("Planning no encontrado"); 
        }
        console.log("Planning:", planning);
        if (planning.usuario_creador.id==user.userId || planning.usuario_participe.id==user.userId){
            return true;
        }

        throw new UnauthorizedException(
            'No tienes permiso para acceder a esta propuesta de partición',
        );

    }
}