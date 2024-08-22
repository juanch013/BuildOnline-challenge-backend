import LoginResponse from "../../../common/types/responses/loginResponse";
import { LoginDto } from "../dtos/loginDto";

export interface IAuthService{
    login(body:LoginDto):Promise<LoginResponse>
}