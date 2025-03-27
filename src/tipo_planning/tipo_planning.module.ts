import { Module } from '@nestjs/common';
import { TipoPlanningService } from './tipo_planning.service';
import { TipoPlanningController } from './tipo_planning.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPlanning } from './entities/tipo_planning.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoPlanning])],
  controllers: [TipoPlanningController],
  providers: [TipoPlanningService],
  exports: [TypeOrmModule]
})
export class TipoPlanningModule {}
