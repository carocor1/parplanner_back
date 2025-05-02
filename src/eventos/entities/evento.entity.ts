import {
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Entity,
  DeleteDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
@Entity()
export class Evento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  diaEvento: Date;

  @Column()
  horaInicio: string;

  @Column()
  horaFin: string;

  @Column()
  alarmaCreador: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.id, { eager: true })
  usuario_creador: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.id, { eager: true })
  usuario_participe: Usuario;
}
