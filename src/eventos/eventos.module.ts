import { Module } from '@nestjs/common';
import { EventosService } from './eventos.service';
import { EventosController } from './eventos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { HijosModule } from 'src/hijos/hijos.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Evento]), HijosModule, UsuariosModule],
  controllers: [EventosController],
  providers: [EventosService],
  exports: [EventosModule, TypeOrmModule],
})
export class EventosModule {}
