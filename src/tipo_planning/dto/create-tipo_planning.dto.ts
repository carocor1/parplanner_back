import { ArrayMinSize, IsArray, IsNumber, IsPositive, IsString, MinLength } from "class-validator";
import { Type } from "class-transformer";

export class CreateTipoPlanningDto {
    @IsString()
    @MinLength(1)
    nombre:string
    
    @IsArray()  
    @ArrayMinSize(2)
    @IsNumber({}, { each: true })
    @IsPositive({ each: true })
    distribucion:number[]


}
