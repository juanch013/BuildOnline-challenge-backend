import CreateContactResponse from "../../../common/types/createContactResponse";
import { CreateContactDto } from "../dtos/createContactDto";

export interface IContactService{
    createContact(contact: CreateContactDto): Promise< CreateContactResponse>
}