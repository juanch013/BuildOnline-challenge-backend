import IContactRepository from "../../repositories/interfaces/contactRepository";
import { CreateContactDto } from "../dtos/createContactDto";
import { IContactService } from "../interfaces/contactService";
import CreateContactResponse from "../../../common/types/responses/createContactResponse"
import { InternalError } from "../../../common/errors/errors";
import GetContactResponse from '../../../common/types/responses/getContactResponse';

export class contactService implements IContactService{
    contact:IContactRepository
    constructor(contact:IContactRepository){
        this.contact = contact;
    }

    async createContact(contact: CreateContactDto): Promise< CreateContactResponse> {
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

    async getContact(contactId: string): Promise<GetContactResponse> {
        try {
            const contactDetail = await this.contact.getContactById(contactId);

            if(!contactDetail){
                const response:GetContactResponse = {
                    code:404,
                    message:"contact not found",
                    data:{}
                }
                return response;
            }

            const response:GetContactResponse = {
                code:200,
                message:"contact detail",
                data:contactDetail
            }

            return response;

        } catch (error) {
            console.log(error,"context: getContact");
            return InternalError; 
        }
    }
}