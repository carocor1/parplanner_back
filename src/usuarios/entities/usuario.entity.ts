import { Hijo } from '../../hijos/entities/hijo.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  contraseña: string;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false })
  apellido: string;

  @Column({ nullable: true })
  nro_telefono: string;

  @Column({ nullable: true })
  fecha_nacimiento: Date;

  @Column({ nullable: true })
  provincia: string;

  @Column({ nullable: true })
  ciudad: string;

  @Column({ nullable: true })
  documento: number;

  @Column({ nullable: true })
  sexo: string;

  @DeleteDateColumn()
  fechaEliminacion: Date;

  @Column({ nullable: true })
  cbu: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  codigoRecuperacion: string;

  @Column({ nullable: true })
  fechaExpiracionCodigo: Date;

  @ManyToOne(() => Hijo, (hijo) => hijo.progenitores)
  @JoinColumn({ name: 'hijo_id' })
  hijo: Hijo;
}
