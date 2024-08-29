import dotenv from 'dotenv'
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ContactEntity } from '../entities/contact.entity';
import { NoteEntity } from '../entities/note.entity';
dotenv.config()

const isTestEnv = process.env.NODE_ENV === 'test';

const dataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: isTestEnv ? `${process.env.DB_NAME}-test` :process.env.DB_NAME,
    entities: [UserEntity,ContactEntity,NoteEntity],
    logging:false,
    synchronize: false,
});
export default dataSource;