import { LoginDto } from "../dtos/loginDto";

export default class AuthService{
    constructor(){}

    login(body:LoginDto){
        try {
            
        } catch (error) {
            console.log(error,"context: login")
        }
    }
}