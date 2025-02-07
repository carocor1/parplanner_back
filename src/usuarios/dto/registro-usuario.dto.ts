import { Type } from 'class-transformer';
import { IsDataURI, IsDate, IsNumber, IsString } from 'class-validator';

export class RegistroUsuarioDto {
  @IsString()
  nro_telefono: string;

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

  @IsString()
  cbu: string;
}
