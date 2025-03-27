import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { MercadoPagoController } from './mercado-pago.controller';
import { GastosModule } from '../gastos/gastos.module';
import { PropuestasParticionModule } from '../propuestas_particion/propuestas_particion.module';

@Module({
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  imports: [GastosModule, PropuestasParticionModule],
})
export class MercadoPagoModule {}
