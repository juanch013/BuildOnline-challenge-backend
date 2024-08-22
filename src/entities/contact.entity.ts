import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name:"contact"})
export class ContactEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({name:"phone_number"})
  phoneNumber: string;
}
