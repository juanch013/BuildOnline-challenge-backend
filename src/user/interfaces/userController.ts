import { IRequest } from "../../../common/types/modifyesTypes/modifyedRequest";
import { Response } from "express";

export default interface IUserController{
    getUser(req:IRequest,res:Response):Promise<Response>;
}