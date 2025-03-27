import { IsEmail } from 'class-validator';

export class RecuperarContraseñaDto {
  @IsEmail()
  email: string;
}
