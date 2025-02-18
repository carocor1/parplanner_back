import { BadRequestException, Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { Gasto } from 'src/gastos/entities/gasto.entity';
import { GastosService } from 'src/gastos/gastos.service';
import { PropuestasParticionService } from 'src/propuestas_particion/propuestas_particion.service';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;

  constructor(
    private readonly gastosService: GastosService,
    private readonly propuestasParticionService: PropuestasParticionService,
  ) {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN,
    });
  }

  async validarGastosPendientesAPagar(gastos: Gasto[]) {
    const gastosPendientes = gastos.filter((gasto) => gasto.estado.id === 3);
    if (gastosPendientes.length !== gastos.length) {
      throw new BadRequestException(
        'Todos los gastos deben estar en estado pendiente',
      );
    }
  }

  async createPreference(gastosIds: number[]) {
    const gastos = await Promise.all(
      gastosIds.map((id) => this.gastosService.findOne(id)),
    );
    await this.validarGastosPendientesAPagar(gastos);

    const items = await Promise.all(
      gastos.map(async (gasto) => {
        const ultimaPropuesta =
          await this.propuestasParticionService.obtenerUltimaParticionPendienteOPagada(
            gasto.id,
          );
        const unit_price =
          (ultimaPropuesta.particion_usuario_participe_gasto * gasto.monto) /
          100;
        return {
          id: gasto.id.toString(),
          title: gasto.titulo,
          quantity: 1,
          currency_id: 'ARS',
          unit_price,
        };
      }),
    );

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
    return { url: response.init_point };
  }

  async processPayment(paymentId: string) {
    const payment = new Payment(this.client);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const paymentData = await payment.get({ id: paymentId });
    if (paymentData.status === 'approved') {
      const gastosIds = this.extractGastoIds(paymentData);
      await Promise.all(
        gastosIds.map((id) => this.gastosService.pagarGastos(id)),
      );
    }
  }

  private extractGastoIds(paymentData: any): number[] {
    return (
      paymentData.additional_info?.items?.map((item) => Number(item.id)) || []
    );
  }
}
