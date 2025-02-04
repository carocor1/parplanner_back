import { PartialType } from '@nestjs/mapped-types';
import { CreateGastoDto } from './create-gasto.dto';
import { IsOptional, Min, Max } from 'class-validator';

export class UpdateGastoDto extends PartialType(CreateGastoDto) {
  @IsOptional()
  titulo?: string;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  monto?: number;

  @IsOptional()
  fecha?: Date;

  @IsOptional()
  @Min(1)
  @Max(100)
  particion_usuario_creador?: number;

  @IsOptional()
  @Min(1)
  @Max(100)
  particion_usuario_participe?: number;

  @IsOptional()
  categoria?: string;
}
