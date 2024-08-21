import { LoginDto } from "../dtos/loginDto";

export interface IAuthService{
    login(body:LoginDto):Promise<string | null>
}