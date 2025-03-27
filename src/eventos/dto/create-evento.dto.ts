import { Type } from "class-transformer";

import { IsDateString, IsString, IsNumber, MinLength, IsBoolean, IsOptional } from "class-validator";
export class CreateEventoDto {

    @IsString()
    @MinLength(4)
    nombre:string; 

    @IsDateString()
    diaEvento:string
    
    @IsString()
    horaInicio:string; 

    @IsString()
    horaFin:string; 

    @IsBoolean()
    @IsOptional()
    alarmaCreador: boolean;
    
    
}
