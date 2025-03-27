import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoPlanningService } from './tipo_planning.service';
import { CreateTipoPlanningDto } from './dto/create-tipo_planning.dto';
import { UpdateTipoPlanningDto } from './dto/update-tipo_planning.dto';

@Controller('tipo-planning')
export class TipoPlanningController {
  constructor(private readonly tipoPlanningService: TipoPlanningService) {}

  @Post()
  create(@Body() createTipoPlanningDto: CreateTipoPlanningDto) {
    return this.tipoPlanningService.create(createTipoPlanningDto);
  }

  @Get()
  findAll() {
    return this.tipoPlanningService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tipoPlanningService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTipoPlanningDto: UpdateTipoPlanningDto) {
    return this.tipoPlanningService.update(id, updateTipoPlanningDto);
  }

  @Delete(':id')
  remove(@Param('id') id:number) {
    return this.tipoPlanningService.remove(id);
  }
}
