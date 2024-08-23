import { ContactData } from "../../contact/interfaces/contactData";

export default interface IContactRepository{
    createContact(name:string,phoneNumber:string,email:string):Promise<ContactData | null>;
    checkEmailExist(email:string):Promise<boolean | null>;
    getContactById(contactId:string):Promise<ContactData | null>;
    checkContactIdExist(id: string): Promise<boolean | null>;
    updateContactData(id:string,name:string,email:string,phoneNumber:string):Promise<ContactData | null>
}