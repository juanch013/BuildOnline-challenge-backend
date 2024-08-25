import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { ContactEntity } from "./contact.entity";

@Entity({name:"note"})
export class NoteEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column('varchar')
  note: string;

  @ManyToOne(() => ContactEntity, contact => contact.notes)
  contact: ContactEntity;

  @CreateDateColumn({name:"created_at"})
  createdAt: Date;
}
