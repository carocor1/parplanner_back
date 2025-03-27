import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/create-user.dto';
import { UsuariosService } from '../usuarios/usuarios.service';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    private jwtService: JwtService,
    private readonly usuarioService: UsuariosService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    if (await this.usuarioService.UserExist(registerDto.email)) {
      throw new BadRequestException('El email ya se encuentra registrado');
    } else {
      const hashPassword = await this.usuarioService.hashPassword(
        registerDto.contraseña,
      );
      const user = this.usuariosRepository.create({
        ...registerDto,
        contraseña: hashPassword,
      });
      await this.usuariosRepository.save(user);
      return await this.generateTokens(user);
    }
  }

  async validateUser(email: string, password: string): Promise<Usuario | null> {
    const user = await this.usuariosRepository.findOne({ where: { email } });
    if (
      user &&
      user.contraseña &&
      (await this.usuarioService.validatePassword(password, user.contraseña))
    ) {
      return user;
    }
    return null;
  }

  async generateTokens(usuario: Usuario) {
    const payload = { email: usuario.email, sub: usuario.id };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async validateOrCreateUserFromGoogle(
    profile: any,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, givenName, familyName, sub } = profile;
    let user = await this.usuariosRepository.findOne({ where: { email } });
    if (!user) {
      user = this.usuariosRepository.create({
        email,
        nombre: givenName,
        apellido: familyName,
        googleId: sub,
      });
    } else {
      user.googleId = sub;
    }
    await this.usuariosRepository.save(user);
    return await this.generateTokens(user);
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verify(refreshToken);
      const user = await this.usuarioService.findOne(payload.sub);
      if (!user) {
        throw new BadRequestException('Refresh token no válido');
      } else {
        return await this.generateTokens(user);
      }
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  async enviarCodigoRecuperacionContraseña(email: string) {
    const user = await this.usuariosRepository.findOne({
      where: { email },
    });
    if (!user || user.googleId) {
      throw new BadRequestException(
        'No hay ningún usuario registrado con ese email o el usuario se registró a través de Google',
      );
    }
    const codigoRecuperacion = uuidv4().substring(0, 6).toUpperCase();
    user.codigoRecuperacion = codigoRecuperacion;
    user.fechaExpiracionCodigo = new Date(Date.now() + 15 * 60 * 1000);
    await this.usuariosRepository.save(user);
    await this.mailService.enviarCodigoRecuperacionContraseña(
      email,
      codigoRecuperacion,
    );
  }

  async ingresarCodigoContraseña(codigo: string) {
    const user = await this.usuariosRepository.findOne({
      where: { codigoRecuperacion: codigo },
    });
    if (!user) {
      throw new BadRequestException('Código de recuperación no válido');
    }
    if (user.fechaExpiracionCodigo < new Date()) {
      throw new BadRequestException('El código de recuperación ha expirado');
    }
    user.codigoRecuperacion = 'VALIDADO';
    user.fechaExpiracionCodigo = null;
    await this.usuariosRepository.save(user);
    return await this.generateTokens(user);
  }

  async cambiarContraseña(contraseñaNueva: string, usuarioId: number) {
    await this.usuarioService.cambiarContraseña(contraseñaNueva, usuarioId);
  }
}
