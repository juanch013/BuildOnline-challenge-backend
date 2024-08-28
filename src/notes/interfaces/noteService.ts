import CreateNoteResponse from '../../../common/types/responses/createNoteResponse'
import GetNoteResponse from '../../../common/types/responses/getNoteResponse';
import ListNotesResponse from '../../../common/types/responses/listNotesResponse';

export default interface INoteService{
    createNote(userid:string,contactId:string,note:string):Promise<CreateNoteResponse>;
    listNotesPaginated(userId:string,page:number,quantity:number):Promise<ListNotesResponse>;
    getNoteById(userId:string,noteId:string):Promise<GetNoteResponse>;
}