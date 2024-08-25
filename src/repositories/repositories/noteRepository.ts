import { userRepository } from './userRepository';
import { noteData } from './../../notes/interfaces/noteData';
import { NoteEntity } from './../../entities/note.entity';
import INoteRepository from "../interfaces/noteRepository";
import dataSource from "../../connection/connection";
import { Repository } from "typeorm";
import { ContactEntity } from "../../entities/contact.entity";
import { UserEntity } from '../../entities/user.entity';

export class noteRepository implements INoteRepository{
    private note:Repository<NoteEntity>
    private contact:Repository<ContactEntity>
    private user:Repository<UserEntity>

    constructor(){
        this.note = dataSource.getRepository(NoteEntity);
        this.contact = dataSource.getRepository(ContactEntity);
        this.user = dataSource.getRepository(UserEntity);
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

    async listNotesPaginated(userid:string,page:number,quantity:number):Promise<noteData[] | null>{
        try {
                const skip = (page - 1) * quantity
                const user = await this.user.findOne({where:{id:userid}});

                if(!user){
                    return null;
                }

                const listedNotes:NoteEntity[] = await this.note.find(
                    {
                        where:{
                            contact:{user:user}
                        },
                        skip:skip,
                        take:quantity
                    }
                )

                return listedNotes.map(note => this.noteDataMapper(note.contact,note))

        } catch (error) {
          console.log(error,"context: listNotesPaginated");
          return null;
        }
    }

    async getNotebById(){}

    
}