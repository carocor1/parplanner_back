import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHijoDto } from './dto/create-hijo.dto';
import { UpdateHijoDto } from './dto/update-hijo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hijo } from './entities/hijo.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { v4 as uuidv4 } from 'uuid';
import { EnviarVinculoHijoDto } from './dto/enviarvinculo-hijo.dto';
import { MailService } from '../mail/mail.service';
import { UsuariosService } from '../usuarios/usuarios.service';

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
    return await this.hijosRepository.save(hijo);
  }

  async enviarCodigoVinculacionProgenitor(
    enviarVinculoHijoDto: EnviarVinculoHijoDto,
    progenitorCreador_id: number,
  ) {
    const progenitor_creador =
      await this.usuariosService.findOne(progenitorCreador_id);
    const hijo = progenitor_creador.hijo;
    if (!hijo) {
      throw new BadRequestException('No estás asoaciado a un hijo');
    }
    if (hijo.progenitores.length >= 2) {
      throw new BadRequestException('Tu hijo ya se encuentra vinculado a otro');
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
      throw new NotFoundException('Hijo no encontrado');
    }
    if (hijo.codigoExpiracion < new Date()) {
      throw new BadRequestException('Código expirado');
    }
    const progenitor = await this.usuariosService.findOne(id);
    if (hijo.progenitores.includes(progenitor)) {
      throw new BadRequestException('Ya está vinculado');
    }
    if (hijo.progenitores.length >= 3) {
      throw new BadRequestException('No puedes vincular más de 3 hijos');
    }
    hijo.progenitores.push(progenitor);
    await this.usuariosRepository.save(progenitor);
    hijo.codigoInvitacion = null;
    hijo.codigoExpiracion = null;
    await this.hijosRepository.save(hijo);
    return hijo;
  }

  async findOne(id: number) {
    const hijo = await this.hijosRepository.findOneBy({ id });
    if (!hijo) {
      throw new NotFoundException('Hijo no encontrado');
    }
    return hijo;
  }

  async update(id: number, updateHijoDto: UpdateHijoDto) {
    const hijo = await this.findOne(id);
    return await this.hijosRepository.save({ ...hijo, ...updateHijoDto });
  }

  async remove(id: number) {
    const hijo = await this.findOne(id);
    for (const progenitor of hijo.progenitores) {
      progenitor.hijo = null;
      await this.usuariosRepository.save(progenitor);
    }
    return await this.hijosRepository.softDelete(id);
  }

  async verificarVinculacion(id: number): Promise<boolean> {
    const progenitor = await this.usuariosService.findOne(id);

    if (!progenitor || !progenitor.hijo) {
      throw new NotFoundException('Progenitor o hijo no encontrado');
    }

    const hijo = await this.hijosRepository.findOne({
      where: { id: progenitor.hijo.id },
      relations: ['progenitores'],
    });

    if (!hijo || hijo.progenitores.length !== 2) {
      return false;
    }
    const [progenitor1, progenitor2] = hijo.progenitores;
    return progenitor1.id !== progenitor2.id;
  }
}
