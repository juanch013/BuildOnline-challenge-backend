import CreateContactResponse from "../../../common/types/responses/createContactResponse";
import GetContactResponse from "../../../common/types/responses/getContactResponse";
import { CreateContactDto } from "../dtos/createContactDto";
import { ContactData } from "./contactData";
import { UpdateContactResponse } from "../../../common/types/responses/updateContactResponse";
import {ListContactsResponse} from "../../../common/types/responses/listContactsResponse"

export interface IContactService{
    createContact(userId:string,contact: CreateContactDto): Promise<CreateContactResponse>;
    getContact(contactId:string):Promise<GetContactResponse>;
    updateContact(userId:string,contactData:ContactData):Promise<UpdateContactResponse>;
    listContacts(userId:string,page:number,quantity:number):Promise<ListContactsResponse>;
}