import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({name:"contact"})
export class ContactEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  email: string;

  @Column('varchar',{name:"phone_number"})
  phoneNumber: string;

  @ManyToOne(() => UserEntity, user => user.contacts)
  user: UserEntity;

  @CreateDateColumn({name:"created_at"})
  createdAt: Date;
}
