import { Body, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { GastosService } from 'src/gastos/gastos.service';
import axios from 'axios';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private preference: Preference;

  constructor(private readonly gastosService: GastosService) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }

  async createPreference(gastosIds: number[]) {
    try {
      console.log(gastosIds);
      const gastos = await Promise.all(
        gastosIds.map((id) => this.gastosService.findOne(id)),
      );
      console.log(gastos);

      const items = gastos.map((gasto) => ({
        id: gasto.id.toString(),
        title: gasto.titulo,
        quantity: 1,
        currency_id: 'ARS',
        unit_price: (gasto.particion_usuario_participe * gasto.monto) / 100,
      }));

      const preference = new Preference(this.client);
      const response = await preference.create({
        body: {
          items,
          back_urls: {
            success: 'https://github.com/carocor1/parplanner_front',
            failure: 'https://github.com/carocor1/parplanner_back',
            pending: 'https://github.com/carocor1/parplanner_back',
          },
          auto_return: 'approved',
        },
      });

      return { url: response.sandbox_init_point };
    } catch (error) {
      console.log(error);
      throw new Error('Error al crear la preferencia de pago');
    }
  }
}
