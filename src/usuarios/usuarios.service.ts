import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { RegistroUsuarioDto } from './dto/registro-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async validatePassword(
    validateContraseña: string,
    contraseñaUsuario: string,
  ): Promise<boolean> {
    return await bcrypt.compareSync(validateContraseña, contraseñaUsuario);
  }

  async hashPassword(contraseña: string): Promise<string> {
    return await bcrypt.hash(contraseña, 10);
  }

  async UserExist(email: string): Promise<Boolean> {
    console.log(email);
    if (await this.usuariosRepository.findOne({ where: { email } })) {
      console.log('true');
      return true;
    } else {
      console.log('false');
      return false;
    }
  }

  async registrarUsuario(registroUsuarioDto: RegistroUsuarioDto, id: number) {
    await this.findOne(id);
    return await this.usuariosRepository.update(id, {
      ...registroUsuarioDto,
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['hijo'],
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);
    return await this.usuariosRepository.update(id, { ...updateUsuarioDto });
  }
}
