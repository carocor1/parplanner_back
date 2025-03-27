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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EsCreadorOParticipeGuardEvento } from 'src/auth/guards/esCreadorOParticipeEvento.guard';
import { EsCreadorGuardEvento } from 'src/auth/guards/esCreadorEvento.guard';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createEventoDto: CreateEventoDto, @Req() req) {
    return this.eventosService.create(createEventoDto, req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  async listarEventosCompartidos(@Req() req) {
    return this.eventosService.listarEventosCompartidos(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuardEvento)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.eventosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuardEvento)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventosService.update(id, updateEventoDto);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuardEvento)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.eventosService.remove(id);
  }
}
