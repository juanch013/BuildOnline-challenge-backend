import LoginResponse from "../../../common/types/loginResponse";
import { LoginDto } from "../dtos/loginDto";

export interface IAuthService{
    login(body:LoginDto):Promise<LoginResponse>
}