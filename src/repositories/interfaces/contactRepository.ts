import { ContactData } from "../../contact/interfaces/contactData";

export default interface IContactRepository{
    createContact(name:string,phoneNumber:string,email:string):Promise<ContactData | null>;
}