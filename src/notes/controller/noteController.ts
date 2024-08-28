import { InternalError } from './../../../common/errors/errors';
import { IRequest } from "../../../common/types/modifyesTypes/modifyedRequest";
import INoteController from "../interfaces/noteController";
import {Response} from 'express'
import INoteService from '../interfaces/noteService';
import MyJwtPayload from '../../../common/types/modifyesTypes/jwtPayload';

export default class NoteController implements INoteController{
    note:INoteService;
    constructor(note:INoteService){
        this.note = note;
    }
    async createNote(req: IRequest, res: Response): Promise<Response> {
        try {
            const { id } = req.loggedUser as MyJwtPayload
            const {contactId} = req.params;
            const { note } = req.body
            const createNoteRet = await this.note.createNote(id,contactId,note);
            return res.status(createNoteRet.code).json(createNoteRet);
        } catch (error) {
            console.log(error,"context: createNote");
            return res.status(InternalError.code).json(InternalError);
        }
    }

    async listNotes(req:IRequest,res:Response):Promise<Response>{
        try {
            const {id} = req.loggedUser as MyJwtPayload;
            const {page,quantity} = req.query

            const list = await this.note.listNotesPaginated(id,Number(page),Number(quantity));
            return res.status(list.code).json(list);
            
        } catch (error) {
            console.log(error,"context: createNote");
            return res.status(InternalError.code).json(InternalError); 
        }
    }

    async getNoteById(req:IRequest,res:Response):Promise<Response>{
        try {
            const {id} = req.loggedUser as MyJwtPayload;
            const {noteId} = req.params
            const getNote = await this.note.getNoteById(id,noteId);
            return res.status(getNote.code).json(getNote);
        } catch (error) {
            console.log(error,"context: getNoteById");
            return res.status(InternalError.code).json(InternalError); 
        }
    }
}