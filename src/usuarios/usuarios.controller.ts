import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('registro')
  async registrarUsuario(
    @Body() registroUsuarioDto: RegistroUsuarioDto,
    @Req() req,
  ) {
    return await this.usuariosService.registrarUsuario(
      registroUsuarioDto,
      req.user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('tiene-hijo')
  async tieneHijos(@Req() req) {
    return await this.usuariosService.tieneHijo(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verificar-registro')
  async verificarRegistro(@Req() req) {
    return await this.usuariosService.verificarRegistro(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number, @Req() req) {
    if (req.user.userId !== id) {
      throw new UnauthorizedException('No autorizado');
    }
    return await this.usuariosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return await this.usuariosService.update(id, updateUsuarioDto);
  }
}
