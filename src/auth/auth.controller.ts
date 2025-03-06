import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registro')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Req() req) {
    return this.authService.generateTokens(req.user);
  }

  @ApiOperation({ summary: 'Iniciar sesión con Google' })
  @ApiResponse({
    status: 200,
    description: 'Redirección a Google para autenticación.',
  })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    console.log('iniciando con google');
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback de Google para autenticación' })
  @ApiResponse({
    status: 200,
    description: 'Autenticación con Google exitosa.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async googleAuthRedirect(@Req() req) {
    return await this.authService.validateOrCreateUserFromGoogle(req.user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refrescar tokens' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          example: 'your-refresh-token',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens refrescados exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
