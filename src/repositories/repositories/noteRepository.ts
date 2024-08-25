import { noteData } from './../../notes/interfaces/noteData';
import { NoteEntity } from './../../entities/note.entity';
import INoteRepository from "../interfaces/noteRepository";
import dataSource from "../../connection/connection";
import { Repository } from "typeorm";
import { ContactEntity } from "../../entities/contact.entity";

export class noteRepository implements INoteRepository{
    private note:Repository<NoteEntity>
    private contact:Repository<ContactEntity>

    constructor(){
        this.note = dataSource.getRepository(NoteEntity);
        this.contact = dataSource.getRepository(ContactEntity);
    }

    async createNote(contactId: string, note: string): Promise<noteData | null> {
        try {
            const contact = await this.contact.findOne({where:{id:contactId}});

            if(!contact){
                return null;
            }

            const noteRet:NoteEntity = await this.note.save({note:note,contact:contact});

            return this.noteDataMapper(contact,noteRet);
        } catch (error) {
            console.log(error,"context:createNote");
            return null;
        }
    }

    noteDataMapper(contact:ContactEntity,note:NoteEntity):noteData{
        const noteData:noteData = {
            note:note.note,
            id:note.id,
            createdAt:note.createdAt.toString()
            //image = contact.image
        }
        return noteData;
    }

    
}