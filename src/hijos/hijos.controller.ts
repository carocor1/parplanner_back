import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HijosService } from './hijos.service';
import { CreateHijoDto } from './dto/create-hijo.dto';
import { UpdateHijoDto } from './dto/update-hijo.dto';
import { VinculacionHijoDto } from './dto/vinculacion-hijo.dto';

@Controller('hijos')
export class HijosController {
  constructor(private readonly hijosService: HijosService) {}

  @Post()
  async create(@Body() createHijoDto: CreateHijoDto) {
    return this.hijosService.create(createHijoDto);
  }

  @Get()
  async findAll() {
    return this.hijosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.hijosService.findOne(id);
  }

  @Post('vinculacion')
  async enviarCodigoVinculacionProgenitor(
    @Body() vinculacionHijoDto: VinculacionHijoDto,
  ) {
    return await this.hijosService.enviarCodigoVinculacionProgenitor(
      vinculacionHijoDto,
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
