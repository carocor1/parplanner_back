import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GastosModule } from './gastos/gastos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CategoriasModule } from './categorias/categorias.module';
import { EstadosModule } from './estados/estados.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { AuthModule } from './auth/auth.module';
import { HijosModule } from './hijos/hijos.module';
import { MailModule } from './mail/mail.module';
import { MercadoPagoModule } from './mercado-pago/mercado-pago.module';
import { PropuestasParticionModule } from './propuestas_particion/propuestas_particion.module';

import { PlanningModule } from './planning/planning.module';
import { TipoPlanningModule } from './tipo_planning/tipo_planning.module';
import { EventosModule } from './eventos/eventos.module';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    GastosModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CategoriasModule,
    EstadosModule,
    UsuariosModule,
    AuthModule,
    HijosModule,
    MailModule,
    MercadoPagoModule,
    PropuestasParticionModule,
    TipoPlanningModule,
    PlanningModule,
    EventosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
