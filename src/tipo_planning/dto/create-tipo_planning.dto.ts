import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateTipoPlanningDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  distribucion: number[];

  @IsOptional()
  predeterminado: boolean;
}
