import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHijoDto } from './dto/create-hijo.dto';
import { UpdateHijoDto } from './dto/update-hijo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hijo } from './entities/hijo.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { v4 as uuidv4 } from 'uuid';
import { VinculacionHijoDto } from './dto/vinculacion-hijo.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class HijosService {
  constructor(
    @InjectRepository(Hijo)
    private readonly hijosRepository: Repository<Hijo>,

    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,

    private readonly mailService: MailService,
  ) {}

  async create(createHijoDto: CreateHijoDto) {
    const progenitor = await this.usuariosRepository.findOneBy({
      id: createHijoDto.progenitor_creador_id,
    });
    if (!progenitor) {
      throw new BadRequestException('Progenitor no encontrado');
    }
    const progenitores = [progenitor];
    const hijo = this.hijosRepository.create({
      ...createHijoDto,
      progenitores,
    });
    return await this.hijosRepository.save(hijo);
  }

  //crea y envía un código de vinculación al hijo
  async enviarCodigoVinculacionProgenitor(
    vinculacionHijoDto: VinculacionHijoDto,
  ) {
    const codigoInvitacion = uuidv4().substring(0, 6).toUpperCase();
    await this.mailService.enviarCodigoVinculacionProgenitor(
      vinculacionHijoDto.email_progenitor, // Correo del progenitor2
      codigoInvitacion,
    );
  }

  async findAll() {
    return await this.hijosRepository.find();
  }

  async findOne(id: number) {
    return this.hijosRepository.findOneBy({ id });
  }

  //COMPLETAR ACTUALIZACIÓN
  async update(id: number, updateHijoDto: UpdateHijoDto) {
    return `This action updates a #${id} hijo`;
  }

  async remove(id: number) {
    return await this.hijosRepository.softDelete(id);
  }
}
