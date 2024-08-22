import { Response } from 'express';
import { create } from "domain";
import IContactRepository from "../../repositories/interfaces/contactRepository";
import { CreateContactDto } from "../dtos/createContactDto";
import { ContactData } from "../interfaces/contactData";
import { IContactService } from "../interfaces/contactService";
import CreateContactResponse from "../../../common/types/createContactResponse"
import { InternalError } from "../../../common/errors/errors";

export class contactService implements IContactService{
    contact:IContactRepository
    constructor(contact:IContactRepository){
        this.contact = contact;
    }

    async createContact(contact: CreateContactDto): Promise< CreateContactResponse | null> {
        try {
            const {name,email,phoneNumber} = contact
            
            const checkEmail = await this.contact.checkEmailExist(email);

            if(checkEmail){
                const response:CreateContactResponse = {
                    code:400,
                    message:"email is already registered in other contact",
                    data:{}
                }
                return response
            }

            const contactData = await this.contact.createContact(contact.name,contact.phoneNumber,contact.email);

            if(!contactData){
                return InternalError;
            }

            const response:CreateContactResponse = {
                code:201,
                message:"Contact created successfully",
                data:contactData
            }
            return response;

        } catch (error) {
            console.log(error,"context: createContact");
            return InternalError;        
        }
    }
}