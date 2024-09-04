import { ContactData } from "../../contact/interfaces/contactData";
import { ContactEntity } from "../../entities/contact.entity";

export default interface IContactRepository{
    createContact(userId:string,name:string,phoneNumber:string,email:string):Promise<ContactData | null>;
    checkEmailExist(userId:string,email:string):Promise<boolean | null>;
    getContactById(contactId:string):Promise<ContactData | null>;
    checkContactIdExistForUser(userId:string,id: string): Promise<boolean | null>;
    updateContactData(userid:string,id:string,name:string,email:string,phoneNumber:string):Promise<ContactData | null>;
    listContactsPaginated(userId:string,page:number,quantity:number):Promise<ContactData[] | null>;
    contactDataMapper(contact:ContactEntity):ContactData;
}