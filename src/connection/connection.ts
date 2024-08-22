import dotenv from 'dotenv'
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ContactEntity } from '../entities/contact.entity';
dotenv.config()

const dataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity,ContactEntity],
    logging:false,
    synchronize: false,
});
export default dataSource;