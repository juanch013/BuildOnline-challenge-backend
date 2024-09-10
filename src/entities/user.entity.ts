import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ContactEntity } from "./contact.entity";

@Entity({name:"users"})
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({type:"varchar"})
  email: string;

  @Column({type:"text"})
  password: string;

  @OneToMany(() => ContactEntity, contact => contact.user)
  contacts: ContactEntity[];
}
