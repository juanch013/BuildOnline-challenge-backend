import CreateContactResponse from "../../../common/types/responses/createContactResponse";
import GetContactResponse from "../../../common/types/responses/getContactResponse";
import { CreateContactDto } from "../dtos/createContactDto";

export interface IContactService{
    createContact(contact: CreateContactDto): Promise<CreateContactResponse>
    getContact(contactId:string):Promise<GetContactResponse>
}