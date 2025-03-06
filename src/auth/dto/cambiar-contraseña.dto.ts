import { IsString, Length } from 'class-validator';

export class CambiarContraseñaDTO {
  @IsString()
  contraseñaNueva: string;
}
