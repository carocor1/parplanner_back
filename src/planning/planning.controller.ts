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
import { PlanningService } from './planning.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EsCreadorOParticipeGuardPlanning } from '../auth/guards/esCreadorOParticipePlanning.guard';
import { EsCreadorGuardPlanning } from '../auth/guards/esCreadorPlanning.guard';
import { EsParticipeGuardPlanning } from '../auth/guards/esParticipePlanning.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Planning } from './entities/planning.entity';

@ApiTags('Planning')
@ApiBearerAuth()
@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo planning' })
  @ApiResponse({
    status: 201,
    description: 'Planning creado exitosamente.',
    type: Planning,
  })
  @ApiResponse({
    status: 400,
    description:
      'Ya existe un planning pendiente o aprobado asociado al progenitor.',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de planning o progenitores no encontrados.',
  })
  async create(@Body() createPlanningDto: CreatePlanningDto, @Req() req) {
    return this.planningService.create(createPlanningDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('previsualizar')
  @ApiOperation({ summary: 'Previsualizar un planning' })
  @ApiResponse({
    status: 200,
    description: 'Planning previsualizado exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de planning o progenitores no encontrados.',
  })
  async previsualizar(
    @Body() createPlanningDto: CreatePlanningDto,
    @Req() req,
  ) {
    return this.planningService.previsualizarPlanning(
      createPlanningDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('ultimoPlanning')
  @ApiOperation({ summary: 'Obtener el último planning del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Último planning obtenido exitosamente.',
    type: Planning,
  })
  @ApiResponse({
    status: 404,
    description: 'Progenitores no encontrados o falta vincular correctamente.',
  })
  async obtenerUltimoPlanning(@Req() req) {
    return await this.planningService.obtenerUltimoPlanning(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuardPlanning)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un planning por ID' })
  @ApiParam({ name: 'id', description: 'ID del planning', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Planning encontrado.',
    type: Planning,
  })
  @ApiResponse({ status: 404, description: 'Planning no encontrado.' })
  findOne(@Param('id') id: number) {
    return this.planningService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuardPlanning)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un planning por ID' })
  @ApiParam({ name: 'id', description: 'ID del planning', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Planning actualizado exitosamente.',
    type: Planning,
  })
  @ApiResponse({ status: 404, description: 'Planning no encontrado.' })
  async update(
    @Param('id') id: number,
    @Body() updatePlanningDto: UpdatePlanningDto,
  ) {
    return this.planningService.update(id, updatePlanningDto);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuardPlanning)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un planning por ID' })
  @ApiParam({ name: 'id', description: 'ID del planning', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Planning eliminado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Planning no encontrado.' })
  async remove(@Param('id') id: number) {
    return this.planningService.remove(id);
  }

  @UseGuards(JwtAuthGuard, EsParticipeGuardPlanning)
  @Post('rechazar/:id')
  @ApiOperation({ summary: 'Rechazar un planning pendiente' })
  @ApiParam({ name: 'id', description: 'ID del planning', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Planning rechazado y nuevo planning creado.',
    type: Planning,
  })
  @ApiResponse({
    status: 400,
    description: 'El planning no se encuentra en estado pendiente.',
  })
  @ApiResponse({ status: 404, description: 'Planning no encontrado.' })
  async rechazarPlanning(
    @Param('id') id: number,
    @Req() req,
    @Body() createPlanningDto: CreatePlanningDto,
  ) {
    return await this.planningService.rechazarPlanning(
      id,
      req.user.userId,
      createPlanningDto,
    );
  }

  @UseGuards(JwtAuthGuard, EsParticipeGuardPlanning)
  @Get('aprobar/:id')
  @ApiOperation({ summary: 'Aprobar un planning pendiente' })
  @ApiParam({ name: 'id', description: 'ID del planning', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Planning aprobado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El planning no se encuentra en estado pendiente.',
  })
  @ApiResponse({ status: 404, description: 'Planning no encontrado.' })
  async aprobarPlanning(@Param('id') id: number) {
    return await this.planningService.aprobarPlanning(id);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuardPlanning)
  @Post('expirar/:id')
  @ApiOperation({ summary: 'Expirar un planning aceptado' })
  @ApiParam({ name: 'id', description: 'ID del planning', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Planning expirado y nuevo planning creado.',
    type: Planning,
  })
  @ApiResponse({
    status: 400,
    description: 'El Planning no se encuentra en estado Aceptado.',
  })
  @ApiResponse({ status: 404, description: 'Planning no encontrado.' })
  async expirarPlanning(
    @Param('id') id: number,
    @Req() req,
    @Body() createPlanningDto: CreatePlanningDto,
  ) {
    return await this.planningService.expirarPlanning(
      id,
      req.user.userId,
      createPlanningDto,
    );
  }
}
