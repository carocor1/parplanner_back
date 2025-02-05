import { IsEmail } from 'class-validator';

export class EnviarVinculoHijoDto {
  @IsEmail()
  email_progenitor: string;
}
