import { Column, PrimaryGeneratedColumn, ManyToOne, Entity, DeleteDateColumn } from "typeorm";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Estado } from "src/estados/entities/estado.entity";
@Entity()
export class Evento {

    @PrimaryGeneratedColumn()
    id:number; 

    @Column()
    nombre:string; 

    @Column("date")
    diaEvento:string;

    @Column("time")
    horaInicio: string; 

    @Column("time")
    horaFin: string; 

    @Column()
    alarmaCreador: boolean; 
    
    @DeleteDateColumn()
    deletedAt:Date;

    @ManyToOne(()=> Estado, (estado)=>estado.id,{eager:true})
    estado:Estado

    @ManyToOne(()=> Usuario, (usuario)=>usuario.id, {eager:true})
    usuario_creador: Usuario;

    @ManyToOne(()=> Usuario, (usuario)=>usuario.id, {eager:true})
    usuario_participe: Usuario;

}
