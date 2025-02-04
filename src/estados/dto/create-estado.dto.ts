import { IsString, MinLength } from 'class-validator';

export class CreateEstadoDto {
  @IsString()
  @MinLength(4)
  nombre: string;
}
