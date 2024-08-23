import { Repository } from 'typeorm';
import userData from '../../auth/interfaces/userData';
import IUserRepository from './../interfaces/userRepository';
import { UserEntity } from '../../entities/user.entity';
import dataSource from '../../connection/connection';

export class userRepository implements IUserRepository{
    private users:Repository<UserEntity>
    constructor(){
        this.users = dataSource.getRepository(UserEntity);
    }

    async chekUserById(id:string):Promise<boolean|null>{
        try {
            return await this.users.exists({where:{id:id}});
        } catch (error) {
            console.log(error,"context: chekUserById")
            return null;
        }
    }

    async getUserByCredentials(username:string,password:string):Promise<userData|null>{
        try {

            const userFind = await this.users.findOne({where:{username,password}});

            if(!userFind){
                return null;
            }

            return this.userDataMapper(userFind);

        } catch (error) {
            console.log(error,"context: getUser")
            return null;
        }
    }

    private userDataMapper(user:UserEntity):userData{
        const userData:userData = {
            username:user.username,
            id:user.id
        }
        return userData;
}
}