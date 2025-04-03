import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PlanningService } from './planning.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EsCreadorOParticipeGuardPlanning } from 'src/auth/guards/esCreadorOParticipePlanning.guard';
import { EsCreadorGuardPlanning } from 'src/auth/guards/esCreadorPlanning.guard';
import { EsParticipeGuardPlanning } from 'src/auth/guards/esParticipePlanning.guard';

@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPlanningDto: CreatePlanningDto, @Req() req) {
    return this.planningService.create(createPlanningDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('previsualizar')
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
  async obtenerUltimoPlanning(@Req() req) {
    return await this.planningService.obtenerUltimoPlanning(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuardPlanning)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.planningService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuardPlanning)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlanningDto: UpdatePlanningDto,
  ) {
    return this.planningService.update(id, updatePlanningDto);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuardPlanning)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.planningService.remove(id);
  }

  @UseGuards(JwtAuthGuard, EsParticipeGuardPlanning)
  @Post('rechazar/:id')
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
  async aprobarPlanning(@Param('id') id: number) {
    return await this.planningService.aprobarPlanning(id);
  }
}
