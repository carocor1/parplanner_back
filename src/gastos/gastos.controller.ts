import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EsCreadorOParticipeGuard } from '../auth/guards/esCreadorOParticipe.guard';
import { EsCreadorGuard } from '../auth/guards/esCreador.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Gasto } from './entities/gasto.entity';

@ApiTags('Gastos')
@ApiBearerAuth()
@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo gasto' })
  @ApiResponse({
    status: 201,
    description: 'Gasto creado exitosamente.',
    type: Gasto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 400, description: 'Categoría no encontrada.' })
  @ApiResponse({
    status: 400,
    description: 'Ya existe una propuesta pendiente o aprobada para este gasto',
  })
  @ApiResponse({
    status: 404,
    description: 'Progenitor partícipe no encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Progenitores no encontrados o falta vincular correctamente',
  })
  async create(@Body() createGastoDto: CreateGastoDto, @Req() req) {
    return await this.gastosService.create(createGastoDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gasto por ID' })
  @ApiParam({ name: 'id', description: 'ID del gasto', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Gasto encontrado.',
    type: Gasto,
  })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado.' })
  async findOne(@Param('id') id: number) {
    return await this.gastosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un gasto por ID' })
  @ApiParam({ name: 'id', description: 'ID del gasto', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Gasto actualizado exitosamente.',
    type: Gasto,
  })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado.' })
  @ApiResponse({ status: 400, description: 'Categoria no encontrada' })
  async update(
    @Param('id') id: number,
    @Body() updateGastoDto: UpdateGastoDto,
  ) {
    return await this.gastosService.update(id, updateGastoDto);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un gasto por ID' })
  @ApiParam({ name: 'id', description: 'ID del gasto', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Gasto eliminado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado.' })
  async remove(@Param('id') id: number) {
    return await this.gastosService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({
    summary:
      'Listar los gastos compartidos del progenitor que envía el access_token junto con su progenitor partícipe en forma descendiente de acuerdo a la fecha de creación',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de gastos compartidos obtenida exitosamente.',
    type: [Gasto],
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({
    status: 404,
    description: 'Progenitores no encontrados o falta vincular correctamente',
  })
  async listarGastosCompartidos(@Req() req) {
    return await this.gastosService.listarGastosCompartidos(req.user.userId);
  }
}
