import { IsNumber } from 'class-validator';

export class CreatePropuestasParticionDto {
  @IsNumber()
  particion_usuario_creador_gasto: number;
  @IsNumber()
  particion_usuario_participe_gasto: number;
}
