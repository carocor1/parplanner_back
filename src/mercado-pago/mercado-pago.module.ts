import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { MercadoPagoController } from './mercado-pago.controller';
import { GastosModule } from 'src/gastos/gastos.module';

@Module({
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  imports: [GastosModule],
})
export class MercadoPagoModule {}
