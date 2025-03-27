import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Inject,
} from '@nestjs/common';


import { Planning } from 'src/planning/entities/planning.entity';
import { PlanningService } from 'src/planning/planning.service';


@Injectable()

export class EsCreadorOParticipeGuardPlanning implements CanActivate{

    constructor(private planningService: PlanningService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        
        const request=context.switchToHttp().getRequest();
        const user= request.user;
        const planningId= request.params.id

        const planning: Planning= await this.planningService.findOne(planningId);


        if (planning.usuario_creador.id!== user.userId && planning.usuario_participe.id!== user.userId){
            throw new ForbiddenException("No se tiene permiso para acceder a este planning")
        }

        return true;
    }
    
}