import { Categoria } from '../../categorias/entities/categoria.entity';
import { Estado } from '../../estados/entities/estado.entity';
import { PropuestasParticion } from '../../propuestas_particion/entities/propuestas_particion.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Gasto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @Column()
  monto: number;

  @Column()
  fecha: Date;

  @DeleteDateColumn()
  fechaEliminacion: Date;

  @ManyToOne(() => Categoria, (categoria) => categoria.id, {
    eager: true,
  })
  categoria: Categoria;

  @ManyToOne(() => Estado, (estado) => estado.id, {
    eager: true,
  })
  estado: Estado;

  @ManyToOne(() => Usuario, (usuario) => usuario.id, { eager: true })
  usuario_creador: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.id, { eager: true })
  usuario_participe: Usuario;

  @OneToMany(
    () => PropuestasParticion,
    (propuestasParticion) => propuestasParticion.gasto,
    { nullable: true, eager: true },
  )
  propuestas_particion: PropuestasParticion[];
}
