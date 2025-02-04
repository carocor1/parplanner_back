import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

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
}
