import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateHijoDto } from './dto/create-hijo.dto';
import { UpdateHijoDto } from './dto/update-hijo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hijo } from './entities/hijo.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { v4 as uuidv4 } from 'uuid';
import { EnviarVinculoHijoDto } from './dto/enviarvinculo-hijo.dto';
import { MailService } from 'src/mail/mail.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class HijosService {
  constructor(
    @InjectRepository(Hijo)
    private readonly hijosRepository: Repository<Hijo>,

    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,

    private readonly usuariosService: UsuariosService,

    private readonly mailService: MailService,
  ) {}

  async create(createHijoDto: CreateHijoDto, progenitor_creador_id: number) {
    const progenitor = await this.usuariosService.findOne(
      progenitor_creador_id,
    );
    if (progenitor.hijo !== null) {
      throw new BadRequestException('Ya tienes un hijo asociado');
    }
    const progenitores = [progenitor];
    const hijo = this.hijosRepository.create({
      ...createHijoDto,
      progenitores,
    });
    console.log('progenitor creador', progenitor);
    return await this.hijosRepository.save(hijo);
  }

  //VER EL TEMA DEL progenitorCreador_id
  async enviarCodigoVinculacionProgenitor(
    enviarVinculoHijoDto: EnviarVinculoHijoDto,
    progenitorCreador_id: number,
  ) {
    const progenitor_creador =
      await this.usuariosService.findOne(progenitorCreador_id);
    const hijo = progenitor_creador.hijo;
    if (!hijo) {
      throw new Error('No existe hijo');
    }
    const codigoInvitacion = uuidv4().substring(0, 6).toUpperCase();
    hijo.codigoInvitacion = codigoInvitacion;
    hijo.codigoExpiracion = new Date(Date.now() + 15 * 60 * 1000);
    await this.hijosRepository.save(hijo);
    await this.mailService.enviarCodigoVinculacionProgenitor(
      enviarVinculoHijoDto.email_progenitor,
      codigoInvitacion,
    );
  }

  async vincularHijo(id: number, codigo: string) {
    const hijo = await this.hijosRepository.findOneBy({
      codigoInvitacion: codigo,
    });
    if (!hijo) {
      throw new BadRequestException('Hijo no encontrado');
    }
    console.log('hijo encontrado:', hijo);
    if (hijo.codigoExpiracion < new Date()) {
      throw new BadRequestException('Código expirado');
    }
    const progenitor = await this.usuariosService.findOne(id);
    console.log('progenitor  a asociar:', progenitor);
    if (progenitor.hijo) {
      throw new ForbiddenException('Ya te encuentras vinculado a otro hijo');
    }
    progenitor.hijo = hijo;
    await this.usuariosRepository.save(progenitor);
    hijo.codigoInvitacion = null;
    hijo.codigoExpiracion = null;
    await this.hijosRepository.save(hijo);
    console.log('hijo vinculado: ', hijo);
    return hijo;
  }

  async findAll() {
    return await this.hijosRepository.find();
  }

  async findOne(id: number) {
    const hijo = await this.hijosRepository.findOneBy({ id });
    if (!hijo) {
      throw new BadRequestException('Hijo no encontrado');
    }
    return hijo;
  }

  //COMPLETAR ACTUALIZACIÓN
  async update(id: number, updateHijoDto: UpdateHijoDto) {
    return `This action updates a #${id} hijo`;
  }

  async remove(id: number) {
    return await this.hijosRepository.softDelete(id);
  }
}
