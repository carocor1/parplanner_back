import { forwardRef, Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { HijosModule } from 'src/hijos/hijos.module';
import { UsuariosController } from './usuarios.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario]), forwardRef(() => HijosModule)],
  providers: [UsuariosService],
  exports: [UsuariosService, TypeOrmModule],
  controllers: [UsuariosController],
})
export class UsuariosModule {}
