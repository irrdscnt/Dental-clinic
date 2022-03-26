
import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RegisterEntity {
    @PrimaryGeneratedColumn("uuid")
    regId?:string;

    @Column({type:'text'})
    name:string;

    @Column()
    phone:string;

    @CreateDateColumn()
    startDate:Date;

    @CreateDateColumn({default:'2022-02-01T00:00:00.000Z'})
    endDate?:Date;

    @Column()
    docId:number;

    @Column({nullable:true})
    price?:number;

    @Column({nullable: true})
    docName?:string;

   

    
    
}