import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Planning } from 'src/planning/entities/planning.entity';
import { PlanningService } from 'src/planning/planning.service';

@Injectable()
export class EsCreadorGuardPlanning implements CanActivate {
  constructor(private planningsService: PlanningService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const planningId = request.params.id;
    const planning: Planning = await this.planningsService.findOne(planningId);
    if (planning.usuario_creador.id !== user.userId) {
      throw new ForbiddenException(
        'No se tiene permiso para editar este planning',
      );
    }
    return true;
  }
}
