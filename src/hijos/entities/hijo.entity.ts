import { Usuario } from 'src/usuarios/entities/usuario.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Hijo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false })
  apellido: string;

  @Column({ nullable: false })
  fecha_nacimiento: Date;

  @Column()
  provincia: string;

  @Column()
  ciudad: string;

  @Column()
  documento: number;

  @Column()
  sexo: string;

  @OneToMany(() => Usuario, (usuario) => usuario.hijo, { nullable: false })
  progenitores: Usuario[];

  @DeleteDateColumn()
  fechaEliminacion: Date;
}
