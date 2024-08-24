import { Request,Response } from "express";
import { IRequest } from "../../../common/types/modifyesTypes/modifyedRequest";

export default interface IContactController{
    createContact(req:IRequest,res:Response):Promise<Response>;
    getContact(req:Request,res:Response): Promise<Response>;
    updateContact(req:Request,res:Response): Promise<Response>;
    listContacts(req:IRequest,res:Response):Promise<Response>;
}