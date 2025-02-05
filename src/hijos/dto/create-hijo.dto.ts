import { Type } from 'class-transformer';
import { IsDate, IsString, MinLength, IsNumber } from 'class-validator';

export class CreateHijoDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsString()
  @MinLength(2)
  apellido: string;

  @IsDate()
  @Type(() => Date)
  fecha_nacimiento: Date;

  @IsString()
  provincia: string;

  @IsString()
  ciudad: string;

  @IsNumber()
  documento: number;

  @IsString()
  sexo: string;

  @IsNumber()
  progenitor_creador_id: number;
}
