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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { PropuestasParticion } from './entities/propuestas_particion.entity';

@ApiTags('PropuestasParticion')
@ApiBearerAuth()
@Controller('propuestas-particion')
export class PropuestasParticionController {
  constructor(
    private readonly propuestasParticionService: PropuestasParticionService,
  ) {}

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuard)
  @Post(':id')
  @ApiOperation({ summary: 'Crear una nueva propuesta de partición' })
  @ApiParam({
    name: 'id',
    description:
      'ID del gasto al cual se le quiere generar una nueva propuesta',
    type: Number,
  })
  @ApiResponse({
    status: 201,
    description: 'Propuesta de partición creada exitosamente.',
    type: PropuestasParticion,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
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
  @ApiOperation({ summary: 'Rechazar una propuesta de partición' })
  @ApiParam({
    name: 'id',
    description: 'ID de la propuesta de partición',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Propuesta de partición rechazada exitosamente.',
    type: PropuestasParticion,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async rechazar(
    @Param('id') id: number,
    @Req() req,
    @Body() createPropuestasParticionDto: CreatePropuestasParticionDto,
  ) {
    return await this.propuestasParticionService.rechazar(
      id,
      req.user.userId,
      createPropuestasParticionDto,
    );
  }

  @UseGuards(JwtAuthGuard, PropuestaParticionGuard)
  @Get('aprobar/:id')
  @ApiOperation({ summary: 'Aprobar una propuesta de partición' })
  @ApiParam({
    name: 'id',
    description: 'ID de la propuesta de partición',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Propuesta de partición aprobada exitosamente.',
    type: PropuestasParticion,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async aprobarSolicitud(@Param('id') id: number, @Req() req) {
    return await this.propuestasParticionService.aprobar(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una propuesta de partición por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la propuesta de partición',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Propuesta de partición encontrada.',
    type: PropuestasParticion,
  })
  @ApiResponse({
    status: 404,
    description: 'Propuesta de partición no encontrada.',
  })
  async findOne(@Param('id') id: number) {
    return await this.propuestasParticionService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuard)
  @Get('ultima-propuesta/:id')
  @ApiOperation({
    summary:
      'Obtener la última propuesta de partición pendiente o pagada de un gasto',
  })
  @ApiParam({ name: 'id', description: 'ID del gasto', type: Number })
  @ApiResponse({
    status: 200,
    description:
      'Última propuesta de partición pendiente o pagada encontrada del gasto.',
    type: PropuestasParticion,
  })
  @ApiResponse({
    status: 404,
    description: 'No hay propuestas pendientes o pagadas.',
  })
  async obtenerUltimaParticionPendiente(@Param('id') gastoId: number) {
    return await this.propuestasParticionService.obtenerUltimaParticionPendienteOPagada(
      gastoId,
    );
  }
}
