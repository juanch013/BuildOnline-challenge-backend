import { IRequest } from "../../../common/types/modifyesTypes/modifyedRequest";
import { Response } from 'express';

export default interface INoteController{
    createNote(req:IRequest,res:Response):Promise<Response>;
    listNotes(req:IRequest,res:Response):Promise<Response>;
}