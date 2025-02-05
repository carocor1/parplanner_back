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

@Controller('hijos')
export class HijosController {
  constructor(private readonly hijosService: HijosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createHijoDto: CreateHijoDto, @Req() req) {
    return this.hijosService.create(createHijoDto, req.user.userId);
  }
  /*
  @Get()
  async findAll() {
    return this.hijosService.findAll();
  }
    */

  @UseGuards(JwtAuthGuard, EsProgenitorDelHijoGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.hijosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, EsProgenitorDelHijoGuard)
  @Post('vinculacion')
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
  async vincularHijo(
    @Body() vinculacionCodigoDto: VinculacionCodigoDto,
    @Req() req,
  ) {
    return await this.hijosService.vincularHijo(
      req.user.userId,
      vinculacionCodigoDto.codigo,
    );
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateHijoDto: UpdateHijoDto) {
    return this.hijosService.update(id, updateHijoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.hijosService.remove(id);
  }
}
