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

    async login(req:Request,res:Response):Promise<Response>{
        try {
            const loginResponse = await this.auth.login(req.body);
            return res.status(loginResponse.code).json(loginResponse);
        } catch (error) {
            console.log(error,"context: login")
            return res.status(InternalError.code).json(InternalError)
        }
    }
}