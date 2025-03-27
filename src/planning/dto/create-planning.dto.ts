import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsPositive } from 'class-validator';
export class CreatePlanningDto {
  @IsDate()
  @Type(() => Date)
  fechaInicio: Date;

  @IsNumber()
  @IsPositive()
  tipoPlanningId: number;
}
