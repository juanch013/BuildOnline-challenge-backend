import LoginResponse from "../../../common/types/loginResponse";
import { Request,Response } from "express";

export interface IAuthController{
    login(req:Request,res:Response):Promise<Response>
}