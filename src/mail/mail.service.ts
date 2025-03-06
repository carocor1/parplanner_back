import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

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
}
