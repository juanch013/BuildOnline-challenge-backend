import { IAuthService } from './../interfaces/authService';
import { Request,Response } from "express"
import LoginResponse from '../../../common/types/loginResponse'
import { IAuthController } from '../interfaces/authController';
import {InternalError, UnautorizedError} from '../../../common/errors/errors'

export class authController implements IAuthController {
    auth:IAuthService;
    constructor(auth:IAuthService){
        this.auth = auth;
    }

    async login(req:Request,res:Response):Promise<LoginResponse>{
        try {
            const loginResponse = await this.auth.login(req.body);

            if(!loginResponse){
                res.status(UnautorizedError.code).json(UnautorizedError)
                return UnautorizedError
            }
            
            const responseBody:LoginResponse = {
                code:200,
                message:"user logged in",
                data:{token:loginResponse}
            }

            res.status(responseBody.code).json(responseBody)
            return responseBody;

        } catch (error) {
            console.log(error,"context: login")

            res.status(InternalError.code).json(InternalError)
            return InternalError
        }
    }
}