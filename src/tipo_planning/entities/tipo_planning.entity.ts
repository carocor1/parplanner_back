import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Planning } from "src/planning/entities/planning.entity";

@Entity()
export class TipoPlanning {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column("simple-array")
    distribucion: number[];

    @OneToMany(() => Planning, (planning) => planning.tipoPlanning)
    plannings: Planning[];

    @DeleteDateColumn()
    deletedAt: Date;
}
