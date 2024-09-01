import LoginResponse from "../../../common/types/responses/loginResponse";
import { LoginDto } from "../dtos/loginDto";
import userData from "./userData";

export interface IAuthService{
    login(body:LoginDto):Promise<LoginResponse>,
    findUserByCredentials(username:string,password:string):Promise<userData | null>,
    createJwt(userData:userData):string | null
}