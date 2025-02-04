import { Gasto } from 'src/gastos/entities/gasto.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Entity,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Gasto, (gasto) => gasto.estado)
  gastos: Gasto[];

  @DeleteDateColumn()
  fechaEliminacion: Date;
}
