import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MercadoPagoService } from './mercado-pago.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('MercadoPago')
@ApiBearerAuth()
@Controller('mercado-pago')
export class MercadoPagoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-preference')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        gastosId: {
          type: 'array',
          items: { type: 'number' },
          example: [1, 2, 3],
        },
      },
    },
  })
  @ApiOperation({ summary: 'Crear una preferencia de pago' })
  @ApiResponse({
    status: 201,
    description: 'Preferencia de pago creada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createPreference(@Body() body: { gastosId: number[] }) {
    return await this.mercadoPagoService.createPreference(body.gastosId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook para recibir notificaciones de pagos' })
  @ApiResponse({
    status: 200,
    description: 'Notificación de pago recibida exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async webhook(@Body() payload: any) {
    if (payload.action === 'payment.created' && payload.data?.id) {
      await this.mercadoPagoService.processPayment(payload.data.id);
    }
  }
}
