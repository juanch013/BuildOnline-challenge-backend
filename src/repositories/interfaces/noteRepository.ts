import { noteData } from "../../notes/interfaces/noteData";

export default interface INoteRepository{
    createNote(contactId:string,note:string):Promise<noteData | null>;
    listNotesPaginated(userid:string,page:number,quantity:number):Promise<noteData[] | null>;
    getNotebById(userId:string,id:string):Promise<noteData | null>;
    checkNoteOwner(userId:string,noteId:string):Promise<boolean | null>;
}