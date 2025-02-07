import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateUsuarioDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  apellido?: string;

  @IsString()
  @IsOptional()
  nro_telefono?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  fecha_nacimiento?: Date;

  @IsString()
  @IsOptional()
  provincia?: string;

  @IsString()
  @IsOptional()
  ciudad?: string;

  @IsNumber()
  @IsOptional()
  documento?: number;

  @IsString()
  @IsOptional()
  sexo?: string;

  @IsString()
  @IsOptional()
  cbu?: string;
}
