import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Estado } from 'src/estados/entities/estado.entity';
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

  @Column()
  particion_usuario_creador: number;

  @Column()
  particion_usuario_participe: number;

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

  /*
  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  usuario_creador: Usuario;
  */
}
