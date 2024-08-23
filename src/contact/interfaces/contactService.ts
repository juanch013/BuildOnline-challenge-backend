import CreateContactResponse from "../../../common/types/responses/createContactResponse";
import GetContactResponse from "../../../common/types/responses/getContactResponse";
import { CreateContactDto } from "../dtos/createContactDto";
import { ContactData } from "./contactData";
import { UpdateContactResponse } from "./updateContactResponse";

export interface IContactService{
    createContact(contact: CreateContactDto): Promise<CreateContactResponse>
    getContact(contactId:string):Promise<GetContactResponse>
    updateContact(contactData:ContactData):Promise<UpdateContactResponse>
}