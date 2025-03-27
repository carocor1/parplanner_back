import { PartialType } from '@nestjs/swagger';
import { CreatePlanningDto } from './create-planning.dto';
import { IsDate, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePlanningDto extends PartialType(CreatePlanningDto) {
    @IsDate()
    @Type(()=>Date)
    fechaInicio?: Date;

    @IsNumber()
    @IsPositive()
    tipoPlanningId?: number;
}
