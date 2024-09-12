import { ContactEntity } from "../../entities/contact.entity";
import { NoteEntity } from "../../entities/note.entity";
import { noteData } from "../../notes/interfaces/noteData";

export function noteDataMapper(note:NoteEntity):noteData{
    const noteData:noteData = {
        note:note.note,
        id:note.id,
        createdAt:note.createdAt.toISOString()
    }
    return noteData;
}