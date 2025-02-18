import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-preference')
  async createPreference(@Body() body: { gastosId: number[] }) {
    return await this.mercadoPagoService.createPreference(body.gastosId);
  }

  @Post('webhook')
  async webhook(@Body() payload: any) {
    if (payload.action === 'payment.created' && payload.data?.id) {
      await this.mercadoPagoService.processPayment(payload.data.id);
    }
  }
}
