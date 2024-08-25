import { InternalError } from './../../../common/errors/errors';
import CreateNoteResponse from "../../../common/types/responses/createNoteResponse";
import INoteRepository from "../../repositories/interfaces/noteRepository";
import INoteService from "../interfaces/noteService";
import IUserRepository from '../../repositories/interfaces/userRepository';
import IContactRepository from '../../repositories/interfaces/contactRepository';
import ListNotesResponse from "../../../common/types/responses/listNotesResponse";

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
            console.log(error,"context: createNote");
            return InternalError;
        }
    }

    async listNotesPaginated(userId:string,page:number,quantity:number):Promise<ListNotesResponse>{
        try {
            page = isNaN(page) ? 1 : page
            quantity = isNaN(quantity) ? 10 : quantity

            const userExist = await this.user.chekUserById(userId);

            if(!userExist){
                const response:CreateNoteResponse = {
                    code:400,
                    message:"user invalid",
                    data:{}
                }
                return response;
            }

            const list = await this.note.listNotesPaginated(userId,page,quantity);

            if(!list){
                const errorResponse:CreateNoteResponse = {
                    code:400,
                    message:"error listing notes",
                    data:{}
                }
                return errorResponse;
            }

            const response:ListNotesResponse = {
                code:200,
                message:"listed notes",
                data:list
            }

            return response;

        } catch (error) {
            console.log(error,"context: listNotesPaginated");
            return InternalError;
        }
    }

    
}