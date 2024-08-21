import { userRepository } from "../../repositories/repositories/userRepository";
import { LoginDto } from "../dtos/loginDto";
import { IAuthService } from "../interfaces/authService";
import userData from "../interfaces/userData";
import * as jwt from 'jsonwebtoken';

export default class AuthService implements IAuthService{
    private users:userRepository;

    constructor(users:userRepository){
        this.users = users;    
    }

    async login(body:LoginDto):Promise<string | null>{
        try {
            const {password,username} = body;

            const userData = await this.findUserByCredentials(username,password);

            if(!userData){
                return null;
            }

            return this.createJwt(userData);
        } catch (error) {
            console.log(error,"context: login");
            return null;
        }
    }

    async findUserByCredentials(username:string,password:string):Promise<userData | null>{
        try {
            return await this.users.getUserByCredentials(username,password);
        } catch (error) {
            console.log(error,"context: findUserByCredentials");
            return null;
        }
    }

    createJwt(userData:userData):string | null{
        try {
            const jwtSecret = String(process.env.JWT_SECRET);
            return jwt.sign(userData,jwtSecret,{expiresIn:'1h'})
        } catch (error) {
            console.log(error,"context creteJwt")
            return null;
        }
    }
}