import { contactRepository } from './../../repositories/repositories/contactRepository';
import { InternalError } from './../../../common/errors/errors';
import CreateNoteResponse from "../../../common/types/responses/createNoteResponse";
import INoteRepository from "../../repositories/interfaces/noteRepository";
import INoteService from "../interfaces/noteService";
import IUserRepository from '../../repositories/interfaces/userRepository';
import { Code } from 'typeorm';
import IContactRepository from '../../repositories/interfaces/contactRepository';

export default class NoteService implements INoteService{
    private user:IUserRepository
    private contact:IContactRepository
    private note:INoteRepository

    constructor(notes:INoteRepository,users:IUserRepository,contacts:IContactRepository){
        this.note = notes;
        this.user = users;
        this.contact = contacts;
    }

    async createNote(userid: string, contactId: string, note: string): Promise<CreateNoteResponse> {
        try {
            const user = await this.user.chekUserById(userid);

            if(!user){
                const response:CreateNoteResponse = {
                    code:400,
                    message:"user invalid",
                    data:{}
                }
                return response;
            }

            const contact = await this.contact.checkContactIdExistForUser(userid,contactId);

            if(!contact){
                const badRequestResponse:CreateNoteResponse = {
                    code:400,
                    message:"contact does not exist for logged user",
                    data:{}
                }
                return badRequestResponse;
            }

            const createNote = await this.note.createNote(contactId,note)

            if(createNote === null){
                const errorResponse:CreateNoteResponse = {
                    code:500,
                    message:"error creating note",
                    data:{}
                }
                return errorResponse
            }

            const response:CreateNoteResponse = {
                code:200,
                message:"Note created successfully",
                data:createNote
            }
            return response;

        } catch (error) {
            console.log(error,"context:createNote");
            return InternalError;
        }
    }

    
}