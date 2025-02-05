import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Gasto } from '../../gastos/entities/gasto.entity';
import { GastosService } from '../../gastos/gastos.service';

@Injectable()
export class EsCreadorGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private gastosService: GastosService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const gastoId = request.params.id;
    const gasto: Gasto = await this.gastosService.findOne(gastoId);
    if (gasto.usuario_creador.id !== user.userId) {
      throw new ForbiddenException(
        'No se tiene permiso para editar este gasto',
      );
    }
    return true;
  }
}
