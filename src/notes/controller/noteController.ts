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
}