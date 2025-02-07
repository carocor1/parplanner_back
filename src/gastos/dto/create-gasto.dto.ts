import {
  IsString,
  IsNumber,
  IsPositive,
  IsDate,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGastoDto {
  @IsString()
  @MinLength(4)
  titulo: string;

  @IsString()
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  monto: number;

  @IsDate()
  @Type(() => Date)
  fecha: Date;

  @IsNumber()
  @Min(1)
  @Max(100)
  particion_usuario_creador: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  particion_usuario_participe: number;

  @IsString()
  categoria: string;
}
