import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
}
