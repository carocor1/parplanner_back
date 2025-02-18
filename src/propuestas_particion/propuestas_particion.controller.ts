import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PropuestasParticionService } from './propuestas_particion.service';
import { CreatePropuestasParticionDto } from './dto/create-propuestas_particion.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EsCreadorOParticipeGuard } from 'src/auth/guards/esCreadorOParticipe.guard';
import { PropuestaParticionGuard } from 'src/auth/guards/propuesta-particion.guard';

@Controller('propuestas-particion')
export class PropuestasParticionController {
  constructor(
    private readonly propuestasParticionService: PropuestasParticionService,
  ) {}

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuard)
  @Post(':id')
  async create(
    @Body() createPropuestasParticionDto: CreatePropuestasParticionDto,
    @Param('id') gastoId: number,
    @Req() req,
  ) {
    return await this.propuestasParticionService.create(
      createPropuestasParticionDto,
      gastoId,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, PropuestaParticionGuard)
  @Post('rechazar/:id')
  async rechazarSolicitud(
    @Param('id') id: number,
    @Req() req,
    @Body() createPropuestasParticionDto: CreatePropuestasParticionDto,
  ) {
    return await this.propuestasParticionService.rechazarPropuesta(
      id,
      req.user.userId,
      createPropuestasParticionDto,
    );
  }

  @UseGuards(JwtAuthGuard, PropuestaParticionGuard)
  @Get('aprobar/:id')
  async aprobarSolicitud(@Param('id') id: number, @Req() req) {
    return await this.propuestasParticionService.aprobarPropuesta(
      id,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.propuestasParticionService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuard)
  @Get('ultima-propuesta/:id')
  async obtenerUltimaParticionPendiente(@Param('id') gastoId: number) {
    return await this.propuestasParticionService.obtenerUltimaParticionPendienteOPagada(
      gastoId,
    );
  }
}
