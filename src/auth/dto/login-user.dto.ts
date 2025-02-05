import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

//en realidad no es necesario tener este DTO, pero lo dejo por si quiero hacer alguna validación en el futuro.
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;
}
