import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  contraseña: string;

  @IsString()
  @MinLength(2)
  @Transform(({ value }) => value.trim())
  nombre: string;

  @IsString()
  @MinLength(2)
  @Transform(({ value }) => value.trim())
  apellido: string;
}
