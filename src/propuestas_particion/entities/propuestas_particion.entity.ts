import { Estado } from 'src/estados/entities/estado.entity';
import { Gasto } from 'src/gastos/entities/gasto.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PropuestasParticion {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.id, { eager: true })
  usuario_creador: Usuario;

  @Column()
  particion_usuario_creador_gasto: number;

  @Column()
  particion_usuario_participe_gasto: number;

  @ManyToOne(() => Estado, (estado) => estado.id, { eager: true })
  estado: Estado;

  @ManyToOne(() => Gasto, (gasto) => gasto.propuestas_particion)
  @JoinColumn({ name: 'gastoId' })
  gasto: Gasto;

  @DeleteDateColumn()
  fechaEliminacion: Date;
}
