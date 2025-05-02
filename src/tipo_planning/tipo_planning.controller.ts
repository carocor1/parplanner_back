import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TipoPlanningService } from './tipo_planning.service';
import { CreateTipoPlanningDto } from './dto/create-tipo_planning.dto';
import { UpdateTipoPlanningDto } from './dto/update-tipo_planning.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TipoPlanning } from './entities/tipo_planning.entity';

@ApiTags('Tipo Planning')
@Controller('tipo-planning')
export class TipoPlanningController {
  constructor(private readonly tipoPlanningService: TipoPlanningService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de planning' })
  @ApiResponse({
    status: 201,
    description: 'Tipo de planning creado exitosamente.',
    type: TipoPlanning,
  })
  @ApiResponse({
    status: 400,
    description: 'La suma de la distribución debe ser igual a 14.',
  })
  create(@Body() createTipoPlanningDto: CreateTipoPlanningDto) {
    return this.tipoPlanningService.create(createTipoPlanningDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener los tipos de planning predeterminados' })
  @ApiResponse({
    status: 200,
    description:
      'Lista de tipos de planning predeterminados obtenida exitosamente.',
    type: [TipoPlanning],
  })
  obtenerTipoPlanningPredeterminados() {
    return this.tipoPlanningService.obtenerTipoPlanningPredeterminados();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de planning por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de planning',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de planning encontrado.',
    type: TipoPlanning,
  })
  @ApiResponse({ status: 404, description: 'Tipo de planning no encontrado.' })
  findOne(@Param('id') id: number) {
    return this.tipoPlanningService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de planning por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de planning',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de planning actualizado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'La suma de la distribución debe ser igual a 14.',
  })
  @ApiResponse({ status: 404, description: 'Tipo de planning no encontrado.' })
  update(
    @Param('id') id: number,
    @Body() updateTipoPlanningDto: UpdateTipoPlanningDto,
  ) {
    return this.tipoPlanningService.update(id, updateTipoPlanningDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de planning por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del tipo de planning',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de planning eliminado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Tipo de planning no encontrado.' })
  remove(@Param('id') id: number) {
    return this.tipoPlanningService.remove(id);
  }
}
