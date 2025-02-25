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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @UseGuards(JwtAuthGuard)
  @Post('registro')
  @ApiOperation({
    summary: 'Registrar los datos de un usuario previamente registrado.',
  })
  @ApiResponse({
    status: 201,
    description: 'Datos del usuario registrados exitosamente.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
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
  @ApiOperation({
    summary:
      'Verificar si el usuario tiene un hijo asociado. Devuelve un boolean.',
  })
  @ApiResponse({
    status: 200,
    description: 'Verificación exitosa.',
    type: Boolean,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async tieneHijos(@Req() req) {
    return await this.usuariosService.tieneHijo(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('verificar-registro')
  @ApiOperation({
    summary:
      'Verificar si el usuario ha completado el registro. Devuelve un boolean.',
  })
  @ApiResponse({
    status: 200,
    description: 'Verificación exitosa.',
    type: Boolean,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async verificarRegistro(@Req() req) {
    return await this.usuariosService.verificarRegistro(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a consultar',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado.',
    type: Usuario,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findOne(@Param('id') id: number, @Req() req) {
    if (req.user.userId !== id) {
      throw new UnauthorizedException('No autorizado');
    }
    return await this.usuariosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a actualizar',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  async update(
    @Param('id') id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return await this.usuariosService.update(id, updateUsuarioDto);
  }
}
