import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
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
}
