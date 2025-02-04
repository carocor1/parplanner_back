import { IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  email: string;
  contraseña: string;
  nombre: string;
  apellido: string;
}
