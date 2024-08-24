import { Response } from 'express';
import { userRepository } from './../../repositories/repositories/userRepository';
import IContactRepository from "../../repositories/interfaces/contactRepository";
import { CreateContactDto } from "../dtos/createContactDto";
import { IContactService } from "../interfaces/contactService";
import CreateContactResponse from "../../../common/types/responses/createContactResponse"
import { InternalError } from "../../../common/errors/errors";
import GetContactResponse from '../../../common/types/responses/getContactResponse';
import { ContactData } from "../interfaces/contactData";
import { UpdateContactResponse } from "../../../common/types/responses/updateContactResponse";
import IUserRepository from '../../repositories/interfaces/userRepository';
import { ListContactsResponse } from '../../../common/types/responses/listContactsResponse';

export class contactService implements IContactService{
    private contact:IContactRepository
    private user:IUserRepository
    constructor(contact:IContactRepository,user:IUserRepository){
        this.contact = contact;
        this.user = user;
    }

    async listContacts(userId:string,page:number,quantity:number):Promise<ListContactsResponse>{
        try {

            page = isNaN(page) ? 1 : page
            quantity = isNaN(quantity) ? 10 : quantity

            const checkUser = await this.user.chekUserById(userId);

            if(!checkUser){
                const response:CreateContactResponse = {
                    code:400,
                    message:"invalid user",
                    data:{}
                }
                return response 
            }

            const listContactsResp = await this.contact.listContactsPaginated(userId,page,quantity)

            if(!listContactsResp){
                const response:CreateContactResponse = {
                    code:400,
                    message:"invalid user",
                    data:{}
                }
                return response 
            }

            const listContactResponse:ListContactsResponse = {
                code:200,
                message:"List contacts for logged in user",
                data:listContactsResp
            }
    
            return listContactResponse;

        } catch (error) {
            console.log(error,"context: listContacts");
            return InternalError;
        }
    }

    async updateContact(userId:string,contactData: ContactData): Promise<UpdateContactResponse> {
        try {
            const {id,email,phoneNumber,name} = contactData;

            const checkUser = await this.user.chekUserById(userId);

            if(!checkUser){
                const response:CreateContactResponse = {
                    code:400,
                    message:"invalid user",
                    data:{}
                }
                return response 
            }

            const checkContactExist = await this.contact.checkContactIdExistForUser(userId,id)

            if(!checkContactExist){
                const response:UpdateContactResponse = {
                    code:400,
                    message:"contact does not exist",
                    data:{}
                }
                return response;
            }

            const checkEmailExist = await this.contact.checkEmailExist(userId,email);

            if(checkEmailExist){
                const response:UpdateContactResponse = {
                    code:400,
                    message:"email is in use by other contact",
                    data:{}
                }
                return response;
            }

            const updateResp = await this.contact.updateContactData(userId,id,email,phoneNumber,name)

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

    async createContact(userId:string,contact: CreateContactDto): Promise<CreateContactResponse> {
        try {
            const {name,email,phoneNumber} = contact

            const checkUser = await this.user.chekUserById(userId);

            if(!checkUser){
                const response:CreateContactResponse = {
                    code:400,
                    message:"invalid user",
                    data:{}
                }
                return response
            }
            
            const checkEmail = await this.contact.checkEmailExist(userId,email);

            if(checkEmail){
                const response:CreateContactResponse = {
                    code:400,
                    message:"email is already registered in other contact",
                    data:{}
                }
                return response
            }

            const contactData = await this.contact.createContact(userId,name,phoneNumber,email);

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