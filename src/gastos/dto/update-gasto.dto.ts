import { PartialType } from '@nestjs/mapped-types';
import { CreateGastoDto } from './create-gasto.dto';
import { IsOptional, Min, Max } from 'class-validator';

export class UpdateGastoDto {
  @IsOptional()
  titulo?: string;

  @IsOptional()
  descripcion?: string;

  @IsOptional()
  monto?: number;

  @IsOptional()
  fecha?: Date;

  @IsOptional()
  categoria?: string;
}
