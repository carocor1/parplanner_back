import { Module } from '@nestjs/common';
import { PropuestasParticionService } from './propuestas_particion.service';
import { PropuestasParticionController } from './propuestas_particion.controller';
import { PropuestasParticion } from './entities/propuestas_particion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastosModule } from 'src/gastos/gastos.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { EstadosModule } from 'src/estados/estados.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PropuestasParticion]),
    GastosModule,
    UsuariosModule,
    EstadosModule,
  ],
  controllers: [PropuestasParticionController],
  providers: [PropuestasParticionService],
  exports: [TypeOrmModule],
})
export class PropuestasParticionModule {}
