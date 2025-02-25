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
import { HijosService } from './hijos.service';
import { CreateHijoDto } from './dto/create-hijo.dto';
import { UpdateHijoDto } from './dto/update-hijo.dto';
import { EnviarVinculoHijoDto } from './dto/enviarvinculo-hijo.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EsProgenitorDelHijoGuard } from 'src/auth/guards/esProgenitorDelHijo.guard';
import { VinculacionCodigoDto } from './dto/vinculacion-codigo.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { Hijo } from './entities/hijo.entity';

@ApiTags('Hijos')
@ApiBearerAuth()
@Controller('hijos')
export class HijosController {
  constructor(private readonly hijosService: HijosService) {}

  @UseGuards(JwtAuthGuard)
  @Get('verificar-vinculacion')
  @ApiOperation({ summary: 'Verificar la vinculación del hijo' })
  @ApiResponse({
    status: 200,
    description: 'Verificación de vinculación exitosa.',
    type: Boolean,
  })
  @ApiResponse({ status: 404, description: 'Progenitor o hijo no encontrado.' })
  async verificarVinculacion(@Req() req) {
    return await this.hijosService.verificarVinculacion(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo hijo' })
  @ApiResponse({
    status: 201,
    description: 'Hijo creado exitosamente.',
    type: Hijo,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createHijoDto: CreateHijoDto, @Req() req) {
    return this.hijosService.create(createHijoDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, EsProgenitorDelHijoGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un hijo por ID' })
  @ApiParam({ name: 'id', description: 'ID del hijo', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Hijo encontrado.',
    type: Hijo,
  })
  @ApiResponse({ status: 404, description: 'Hijo no encontrado.' })
  async findOne(@Param('id') id: number) {
    return this.hijosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('vinculacion')
  @ApiOperation({ summary: 'Enviar código de vinculación a otro progenitor' })
  @ApiResponse({
    status: 200,
    description: 'Código de vinculación enviado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async enviarCodigoVinculacionProgenitor(
    @Body() enviarVinculoHijoDto: EnviarVinculoHijoDto,
    @Req() req,
  ) {
    return await this.hijosService.enviarCodigoVinculacionProgenitor(
      enviarVinculoHijoDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('vincular-codigo')
  @ApiOperation({ summary: 'Vincular hijo usando un código de vinculación' })
  @ApiResponse({
    status: 200,
    description: 'Hijo vinculado exitosamente.',
    type: Hijo,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Hijo no encontrado.' })
  async vincularHijo(
    @Body() vinculacionCodigoDto: VinculacionCodigoDto,
    @Req() req,
  ) {
    return await this.hijosService.vincularHijo(
      req.user.userId,
      vinculacionCodigoDto.codigo,
    );
  }

  @UseGuards(JwtAuthGuard, EsProgenitorDelHijoGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un hijo por ID' })
  @ApiParam({ name: 'id', description: 'ID del hijo', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Hijo actualizado exitosamente.',
    type: Hijo,
  })
  @ApiResponse({ status: 404, description: 'Hijo no encontrado.' })
  async update(@Param('id') id: number, @Body() updateHijoDto: UpdateHijoDto) {
    return this.hijosService.update(id, updateHijoDto);
  }

  @UseGuards(JwtAuthGuard, EsProgenitorDelHijoGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un hijo por ID' })
  @ApiParam({ name: 'id', description: 'ID del hijo', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Hijo eliminado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Hijo no encontrado.' })
  async remove(@Param('id') id: number) {
    return this.hijosService.remove(id);
  }
}
