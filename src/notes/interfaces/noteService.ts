import CreateNoteResponse from '../../../common/types/responses/createNoteResponse'

export default interface INoteService{
    createNote(userid:string,contactId:string,note:string):Promise<CreateNoteResponse>;
}