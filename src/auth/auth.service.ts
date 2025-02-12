import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/create-user.dto';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
    private jwtService: JwtService,
    private readonly usuarioService: UsuariosService,
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
      return await this.generateToken(user);
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

  async generateToken(usuario: Usuario) {
    const payload = { email: usuario.email, sub: usuario.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateOrCreateUserFromGoogle(
    profile: any,
  ): Promise<{ access_token: string }> {
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
    return this.generateToken(user);
  }
}
