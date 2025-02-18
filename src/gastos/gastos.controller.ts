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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EsCreadorOParticipeGuard } from 'src/auth/guards/esCreadorOParticipe.guard';
import { EsCreadorGuard } from 'src/auth/guards/esCreador.guard';

@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createGastoDto: CreateGastoDto, @Req() req) {
    return await this.gastosService.create(createGastoDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, EsCreadorOParticipeGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.gastosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateGastoDto: UpdateGastoDto,
  ) {
    return await this.gastosService.update(id, updateGastoDto);
  }

  @UseGuards(JwtAuthGuard, EsCreadorGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.gastosService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listarGastosCompartidos(@Req() req) {
    return await this.gastosService.listarGastosCompartidos(req.user.userId);
  }
}
