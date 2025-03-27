import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Gasto } from 'src/gastos/entities/gasto.entity';
import { PropuestasParticion } from 'src/propuestas_particion/entities/propuestas_particion.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async enviarCodigoVinculacionProgenitor(email: string, codigo: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Código de invitación',
      template: 'invitacion',
      context: { codigo },
    });
  }

  async enviarCodigoRecuperacionContraseña(email: string, codigo: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Código de recuperación de contraseña',
      template: 'recuperacion_contraseña',
      context: { codigo },
    });
  }

  async enviarNotificaciónRechazoParticion(
    usuarioNombre: string,
    email: string,
    gastoTitulo: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Rechazo de propuesta de partición',
      template: 'rechazo_propuesta',
      context: { gastoTitulo, usuarioNombre },
    });
  }

  async enviarNotificaciónAprobacionParticion(
    usuarioNombre: string,
    email: string,
    gastoTitulo: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Aprobación de propuesta de partición',
      template: 'aprobacion_propuesta',
      context: { gastoTitulo, usuarioNombre },
    });
  }
}
