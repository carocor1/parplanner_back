import { IsNumber, Max, Min } from 'class-validator';

export class ProponerParticionDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  particion_usuario_creador: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  particion_usuario_participe: number;
}
