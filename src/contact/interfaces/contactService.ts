import CreateContactResponse from "../../../common/types/createContactResponse";
import GetContactResponse from "../../../common/types/getContactResponse";
import { CreateContactDto } from "../dtos/createContactDto";

export interface IContactService{
    createContact(contact: CreateContactDto): Promise<CreateContactResponse>
    getContact(contactId:string):Promise<GetContactResponse>
}