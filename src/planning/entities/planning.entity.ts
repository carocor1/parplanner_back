import { TipoPlanning } from "src/tipo_planning/entities/tipo_planning.entity";
import { Column, ManyToOne,DeleteDateColumn, PrimaryGeneratedColumn,Entity } from "typeorm";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Estado } from "src/estados/entities/estado.entity";


@Entity()
export class Planning {
    @PrimaryGeneratedColumn()
    id:number; 

    @Column()
    fechaInicio:Date; 

    @DeleteDateColumn()
    deleatedAt: Date; 

   @ManyToOne(() => TipoPlanning, (tipoPlanning) => tipoPlanning.id, {
       eager: true,
    })
    tipoPlanning: TipoPlanning;
    
    
    @ManyToOne(()=>Estado, (estado)=>estado.id,{eager:true})
    estado:Estado;

    @ManyToOne(()=> Usuario, (usuario)=>usuario.id, {eager:true})
    usuario_creador: Usuario; 

    @ManyToOne(()=> Usuario, (usuario)=>usuario.id, {eager:true})
    usuario_participe: Usuario; 

    @Column('simple-array', { nullable: true })
    fechasAsignadasCreador: string[];
  
    @Column('simple-array', { nullable: true })
    fechasAsignadasParticipe: string[];


}
