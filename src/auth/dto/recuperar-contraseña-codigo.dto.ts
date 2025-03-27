import { IsString, Length } from 'class-validator';

export class RecuperarContraseñaCodigoDto {
  @IsString()
  @Length(6)
  codigo: string;
}
