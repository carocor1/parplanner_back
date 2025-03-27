import { Module } from '@nestjs/common';
import { PlanningService } from './planning.service';
import { PlanningController } from './planning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planning } from './entities/planning.entity';
import { TipoPlanning } from 'src/tipo_planning/entities/tipo_planning.entity';
import { EstadosModule } from 'src/estados/estados.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { HijosModule } from 'src/hijos/hijos.module';

@Module({
  imports:[TypeOrmModule.forFeature([Planning, TipoPlanning]), 
  EstadosModule, UsuariosModule, HijosModule],
  controllers: [PlanningController],
  providers: [PlanningService],
  exports:[TypeOrmModule]
})
export class PlanningModule {}
