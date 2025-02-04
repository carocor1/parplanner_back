import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoDto } from './create-estado.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEstadoDto extends PartialType(CreateEstadoDto) {
  @IsOptional()
  @IsString()
  nombre?: string;
}
