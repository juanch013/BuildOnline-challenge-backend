import dotenv from 'dotenv'
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
dotenv.config()

const dataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User],
    logging:false,
    synchronize: true,
});
export default dataSource;