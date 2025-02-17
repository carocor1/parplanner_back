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
import { PropuestasParticionService } from './propuestas_particion.service';
import { CreatePropuestasParticionDto } from './dto/create-propuestas_particion.dto';
import { UpdatePropuestasParticionDto } from './dto/update-propuestas_particion.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EsCreadorOParticipeGuard } from 'src/auth/guards/esCreadorOParticipe.guard';

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

  @Get()
  findAll() {
    return this.propuestasParticionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.propuestasParticionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatePropuestasParticionDto: UpdatePropuestasParticionDto,
  ) {
    return this.propuestasParticionService.update(
      id,
      updatePropuestasParticionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.propuestasParticionService.remove(id);
  }
}
