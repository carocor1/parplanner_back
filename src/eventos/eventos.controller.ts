import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EsCreadorOParticipeGuardEvento } from '../auth/guards/esCreadorOParticipeEvento.guard';
import { EsCreadorGuardEvento } from '../auth/guards/esCreadorEvento.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Evento } from './entities/evento.entity';

@ApiTags('Eventos')
@ApiBearerAuth()
@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo evento' })
  @ApiResponse({
    status: 201,
    description: 'Evento creado exitosamente.',
    type: Evento,
  })
  @ApiResponse({
    status: 404,
    description: 'Progenitor partícipe no encontrado',
  })
  @ApiResponse({
    status: 404,
    description:
      'Progenitores no encontrados o hijo no vinculado correctamente',
  })
  async create(@Body() createEventoDto: CreateEventoDto, @Req() req) {
    return this.eventosService.create(createEventoDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary:
      'Listar los eventos compartidos del progenitor que envía el access_token junto con su progenitor partícipe, ordenados por día y hora de inicio',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de eventos compartidos obtenida exitosamente.',
    type: [Evento],
  })
  @ApiResponse({
    status: 404,
    description: 'Progenitores no encontrados o falta vincular correctamente',
  })
  async listarEventosCompartidos(@Req() req) {
    return this.eventosService.listarEventosCompartidos(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuardEvento)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento por ID' })
  @ApiParam({ name: 'id', description: 'ID del evento', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Evento encontrado.',
    type: Evento,
  })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  findOne(@Param('id') id: number) {
    return this.eventosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuardEvento)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un evento por ID' })
  @ApiParam({ name: 'id', description: 'ID del evento', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Evento actualizado exitosamente.',
    type: Evento,
  })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  update(@Param('id') id: number, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventosService.update(id, updateEventoDto);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuardEvento)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un evento por ID' })
  @ApiParam({ name: 'id', description: 'ID del evento', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Evento eliminado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Evento no encontrado.' })
  remove(@Param('id') id: number) {
    return this.eventosService.remove(id);
  }
}
