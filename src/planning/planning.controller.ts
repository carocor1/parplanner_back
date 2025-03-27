import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PlanningGuard } from 'src/auth/guards/planning.guard';
import { EsCreadorOParticipeGuardPlanning } from 'src/auth/guards/esCreadorOParticipePlanning.guard';
import { EsCreadorGuardPlanning } from 'src/auth/guards/esCreadorPlanning.guard';

@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPlanningDto: CreatePlanningDto,@Req() req) {
    return this.planningService.create(createPlanningDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listarPlanningsCompartidos(@Req() req ) {
    return this.planningService.listarPlanningsCompartidos(req.user.id);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuardPlanning)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planningService.findOne(+id);
  }
  
  @UseGuards(JwtAuthGuard, EsCreadorGuardPlanning)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePlanningDto: UpdatePlanningDto,) {
    return this.planningService.update(id, updatePlanningDto);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuardPlanning)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.planningService.remove(id);
  }

  @UseGuards(JwtAuthGuard,PlanningGuard)
  @Post ('rechazar/:id')
  async rechazarPlanning(@Param('id') id:number, @Req() req, @Body() createPlanningDto: CreatePlanningDto){
    return await this.planningService.rechazarPlanning(id, req.user.userId, createPlanningDto)
  }; 

  @UseGuards(JwtAuthGuard,PlanningGuard)
  @Get ('aprobar/:id')
  async aprobarPlanning(@Param('id') id:number, @Req() req){
    console.log("User ID from request:", req.user.userId);
    return await this.planningService.aprobarPlanning(id, req.user.userId);

  };

  @Get ('ultimapropuesta/:id')
  async obtenerUltimoPlanningPendiente(@Param('id') planningId:number){
    return await this.planningService.obtenerUltimoPlanningPendiente(planningId);

  }


}
