import { Gasto } from '../../gastos/entities/gasto.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Gasto, (gasto) => gasto.categoria)
  gastos: Gasto[];

  @DeleteDateColumn()
  deletedAt: Date;
}
