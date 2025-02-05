import { IsString } from 'class-validator';

export class VinculacionCodigoDto {
  @IsString()
  codigo: string;
}
