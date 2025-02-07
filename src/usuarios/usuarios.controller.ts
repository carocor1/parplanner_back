import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
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

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return await this.usuariosService.update(id, updateUsuarioDto);
  }
}
