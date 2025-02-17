import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @Post('create-preference')
  async createPreference(@Body() body: { gastosId: number[] }) {
    return await this.mercadoPagoService.createPreference(body.gastosId);
  }

  @Post('webhook')
  async webhook(@Body() body: any, @Req() req) {
    if (body.action === 'payment.created') {
      console.log('Actualizar gastos');
    }
  }
}
