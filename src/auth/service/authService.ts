import { InternalError, UnautorizedError } from "../../../common/errors/errors";
import LoginResponse from "../../../common/types/responses/loginResponse";
import IUserRepository from "../../repositories/interfaces/userRepository";
import { LoginDto } from "../dtos/loginDto";
import { IAuthService } from "../interfaces/authService";
import userData from "../interfaces/userData";
import * as jwt from 'jsonwebtoken';

export default class AuthService implements IAuthService{
    private users:IUserRepository;

    constructor(users:IUserRepository){
        this.users = users;    
    }

    async login(body:LoginDto):Promise<LoginResponse>{
        try {
            const {password,username} = body;

            const userData = await this.findUserByCredentials(username,password);

            if(!userData){
                return UnautorizedError
            }

            const token =  this.createJwt(userData);
            
            
            const responseBody:LoginResponse = {
                code:200,
                message:"user logged in",
                data:{token}
            }
            return responseBody;

        } catch (error) {
            console.log(error,"context: login");
            return InternalError;
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