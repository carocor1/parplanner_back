import { forwardRef, Module } from '@nestjs/common';
import { PropuestasParticionService } from './propuestas_particion.service';
import { PropuestasParticionController } from './propuestas_particion.controller';
import { PropuestasParticion } from './entities/propuestas_particion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastosModule } from '../gastos/gastos.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { EstadosModule } from '../estados/estados.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropuestasParticion]),
    UsuariosModule,
    EstadosModule,
    MailModule,
    forwardRef(() => GastosModule),
  ],
  controllers: [PropuestasParticionController],
  providers: [PropuestasParticionService],
  exports: [TypeOrmModule, PropuestasParticionService],
})
export class PropuestasParticionModule {}
