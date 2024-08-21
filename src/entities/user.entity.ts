import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({name:"users"})
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({type:"varchar"})
  username: string;

  @Column({type:"text"})
  password: string;

}
