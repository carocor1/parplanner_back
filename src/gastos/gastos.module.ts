import { forwardRef, Module } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { GastosController } from './gastos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { EstadosModule } from 'src/estados/estados.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { HijosModule } from 'src/hijos/hijos.module';
import { PropuestasParticionModule } from 'src/propuestas_particion/propuestas_particion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gasto]),
    CategoriasModule,
    EstadosModule,
    UsuariosModule,
    HijosModule,
    forwardRef(() => PropuestasParticionModule),
  ],
  controllers: [GastosController],
  providers: [GastosService],
  exports: [GastosService, TypeOrmModule],
})
export class GastosModule {}
