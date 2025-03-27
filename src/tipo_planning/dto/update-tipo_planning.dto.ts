import { PartialType } from '@nestjs/swagger';
import { CreateTipoPlanningDto } from './create-tipo_planning.dto';
import { IsString, MinLength,IsArray, ArrayMinSize, IsNumber, IsPositive } from 'class-validator';

export class UpdateTipoPlanningDto extends PartialType(CreateTipoPlanningDto) {
    @IsString()
    @MinLength(4)
    nombre:string
        
    @IsArray()
    @ArrayMinSize(2)
    @IsNumber({}, { each: true })
    @IsPositive({each:true})
    distribucion:number[]
    
}
