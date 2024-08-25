import { noteData } from "../../notes/interfaces/noteData";

export default interface INoteRepository{
    createNote(contactId:string,note:string):Promise<noteData | null>;
}