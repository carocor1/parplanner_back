import { Module } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { GastosController } from './gastos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { EstadosModule } from 'src/estados/estados.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { HijosModule } from 'src/hijos/hijos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gasto]),
    CategoriasModule,
    EstadosModule,
    UsuariosModule,
    HijosModule,
  ],
  controllers: [GastosController],
  providers: [GastosService],
})
export class GastosModule {}
