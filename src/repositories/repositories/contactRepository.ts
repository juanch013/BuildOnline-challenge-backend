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

    async checkEmailExist(email: string): Promise<boolean | null> {
        try {
            return await this.contacts.exists({where:{email:email}});
        } catch (error) {
            console.log(error,"context: checkEmialExist")
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