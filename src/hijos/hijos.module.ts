import { forwardRef, Module } from '@nestjs/common';
import { HijosService } from './hijos.service';
import { HijosController } from './hijos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hijo } from './entities/hijo.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hijo]),
    forwardRef(() => UsuariosModule),
    MailModule,
  ],
  controllers: [HijosController],
  providers: [HijosService],
  exports: [HijosService],
})
export class HijosModule {}
