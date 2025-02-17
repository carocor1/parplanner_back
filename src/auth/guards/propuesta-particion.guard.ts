import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PropuestasParticionService } from 'src/propuestas_particion/propuestas_particion.service';

@Injectable()
export class PropuestaParticionGuard implements CanActivate {
  constructor(
    private readonly propuestasParticionService: PropuestasParticionService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const propuestaId = request.params.id;

    if (!user || !propuestaId) {
      throw new BadRequestException();
    }
    const propuesta =
      await this.propuestasParticionService.findOne(propuestaId);

    if (!propuesta) {
      throw new NotFoundException('Propuesta de partición no encontrada');
    }

    const gasto = propuesta.gasto;

    if (
      gasto.usuario_creador.id === user.userId ||
      gasto.usuario_participe.id === user.userId
    ) {
      return true;
    }

    throw new UnauthorizedException(
      'No tienes permiso para acceder a esta propuesta de partición',
    );
  }
}
