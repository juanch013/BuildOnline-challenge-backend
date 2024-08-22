import { Request,Response } from "express";

export default interface IContactController{
    createContact(req:Request,res:Response):Promise<Response>;
}