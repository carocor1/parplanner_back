import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Hijo } from '../../hijos/entities/hijo.entity';
import { HijosService } from '../../hijos/hijos.service';
import { UsuariosService } from '../../usuarios/usuarios.service';

@Injectable()
export class EsProgenitorDelHijoGuard implements CanActivate {
  constructor(
    private hijosService: HijosService,
    private usuariosService: UsuariosService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const hijoId = request.params.id;
    if (!hijoId) {
      const progenitor = await this.usuariosService.findOne(user.userId);
      if (!progenitor.hijo) {
        throw new ForbiddenException('No tienes un hijo asociado');
      }
      return true;
    }
    const hijo: Hijo = await this.hijosService.findOne(hijoId);
    const esProgenitor = hijo.progenitores.some(
      (usuario) => usuario.id === user.userId,
    );

    if (!esProgenitor) {
      throw new ForbiddenException(
        'No se tiene permiso para acceder a este hijo',
      );
    }
    return true;
  }
}
