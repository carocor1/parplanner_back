import { Gasto } from 'src/gastos/entities/gasto.entity';
import { PropuestasParticion } from 'src/propuestas_particion/entities/propuestas_particion.entity';
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

  @OneToMany(
    () => PropuestasParticion,
    (propuestas_particion) => propuestas_particion.estado,
  )
  propuestas_particion: PropuestasParticion[];

  @Column()
  ambito: string;
}
