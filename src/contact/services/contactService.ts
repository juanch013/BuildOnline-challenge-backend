import IContactRepository from "../../repositories/interfaces/contactRepository";
import { CreateContactDto } from "../dtos/createContactDto";
import { IContactService } from "../interfaces/contactService";
import CreateContactResponse from "../../../common/types/responses/createContactResponse"
import { InternalError } from "../../../common/errors/errors";
import GetContactResponse from '../../../common/types/responses/getContactResponse';
import { ContactData } from "../interfaces/contactData";
import { UpdateContactResponse } from "../interfaces/updateContactResponse";

export class contactService implements IContactService{
    contact:IContactRepository
    constructor(contact:IContactRepository){
        this.contact = contact;
    }

    async updateContact(contactData: ContactData): Promise<UpdateContactResponse> {
        try {
            const {id,email,phoneNumber,name} = contactData;

            const checkContactExist = await this.contact.checkContactIdExist(id)

            if(!checkContactExist){
                const response:UpdateContactResponse = {
                    code:400,
                    message:"contact does not exist",
                    data:{}
                }
                return response;
            }

            const checkEmailExist = await this.contact.checkEmailExist(email);

            if(checkEmailExist){
                const response:UpdateContactResponse = {
                    code:400,
                    message:"email is in use by other contact",
                    data:{}
                }
                return response;
            }

            const updateResp = await this.contact.updateContactData(id,email,phoneNumber,name)

            if(!updateResp){
                return InternalError
            }

            const response:UpdateContactResponse = {
                code:200,
                message:"contact updated successfully",
                data:updateResp
            }
            return response;

        } catch (error) {
            console.log(error,"context: createContact");
            return InternalError; 
        }
    }

    async createContact(contact: CreateContactDto): Promise<CreateContactResponse> {
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