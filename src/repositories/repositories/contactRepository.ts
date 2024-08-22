import { Repository } from "typeorm";
import { ContactData } from "../../contact/interfaces/contactData";
import { ContactEntity } from "../../entities/contact.entity";
import dataSource from "../../connection/connection";
import IContactRepository from "../interfaces/contactRepository";

export class contactRepository implements IContactRepository{
    contacts:Repository<ContactEntity>;
    constructor(){
        this.contacts = dataSource.getRepository(ContactEntity);
    }

    async getContactById(contactId: string): Promise<ContactData | null> {
        try {
            const entity = await this.contacts.findOne({where:{id:contactId}});
            return entity === null ? null : this.contactDataMapper(entity);
        } catch (error) {
            console.log(error,"context: getContactById")
            return null;
        }
    }

    async checkEmailExist(email: string): Promise<boolean | null> {
        try {
            return await this.contacts.exists({where:{email:email}});
        } catch (error) {
            console.log(error,"context: checkEmialExist")
            return null;
        }
    }

    async checkContactIdExist(id: string): Promise<boolean | null> {
        try {
            return await this.contacts.exists({where:{id:id}});
        } catch (error) {
            console.log(error,"context: checkContactIdExist")
            return null;
        }
    }

    async createContact(name:string,phoneNumber:string,email:string):Promise<ContactData | null>{
        try {
            const save = await this.contacts.save({name,phoneNumber,email});
            return this.contactDataMapper(save);
        } catch (error) {
            console.log(error,"context: createContact")
            return null;
        }
    }

    contactDataMapper(contact:ContactEntity):ContactData{
        const contactData:ContactData = {
            ...contact
        }
        return contactData;
    }
}