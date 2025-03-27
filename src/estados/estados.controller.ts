import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EstadosService } from './estados.service';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Estado } from './entities/estado.entity';

@ApiTags('Estados')
@ApiBearerAuth()
@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo estado' })
  @ApiResponse({
    status: 201,
    description: 'Estado creado exitosamente.',
    type: Estado,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createEstadoDto: CreateEstadoDto) {
    return this.estadosService.create(createEstadoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los estados' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados obtenida exitosamente.',
    type: [Estado],
  })
  findAll() {
    return this.estadosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un estado por ID' })
  @ApiParam({ name: 'id', description: 'ID del estado', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Estado encontrado.',
    type: Estado,
  })
  @ApiResponse({ status: 404, description: 'Estado no encontrado.' })
  findOne(@Param('id') id: number) {
    return this.estadosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un estado por ID' })
  @ApiParam({ name: 'id', description: 'ID del estado', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado exitosamente.',
    type: Estado,
  })
  @ApiResponse({ status: 404, description: 'Estado no encontrado.' })
  update(@Param('id') id: number, @Body() updateEstadoDto: UpdateEstadoDto) {
    return this.estadosService.update(id, updateEstadoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estado por ID' })
  @ApiParam({ name: 'id', description: 'ID del estado', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Estado eliminado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Estado no encontrado.' })
  remove(@Param('id') id: number) {
    return this.estadosService.remove(id);
  }
}
