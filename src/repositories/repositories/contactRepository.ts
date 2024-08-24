import { Repository } from "typeorm";
import { ContactData } from "../../contact/interfaces/contactData";
import { ContactEntity } from "../../entities/contact.entity";
import dataSource from "../../connection/connection";
import IContactRepository from "../interfaces/contactRepository";
import { UserEntity } from "../../entities/user.entity";

export class contactRepository implements IContactRepository{
    private contacts:Repository<ContactEntity>;
    private users:Repository<UserEntity>

    constructor(){
        this.contacts = dataSource.getRepository(ContactEntity);
        this.users = dataSource.getRepository(UserEntity);
    }

    async getContactById(contactId: string): Promise<ContactData | null> {
        try {
            const entity = await this.contacts.findOne({where:{id:contactId}});
            return entity === null ? null : this.contactDataMapper(entity);
        } catch (error) {
            console.log(error,"context: getContactById")
            return null;
        }
    }

    async checkEmailExist(userId:string,email: string): Promise<boolean | null> {
        try {
            const user = await this.users.findOne({where:{id:userId}});
            
            if(!user){
                return null;
            }

            return await this.contacts.exists(
                {
                    where:{
                        email:email,
                        user:user
                    }
                }
            );
        } catch (error) {
            console.log(error,"context: checkEmialExist")
            return null;
        }
    }

    async checkContactIdExistForUser(userId:string,id: string): Promise<boolean | null> {
        try {
            const user = await this.users.findOne({where:{id:userId}});

            if(!user){
                return null;
            }

            return await this.contacts.exists(
                {
                    where:{
                        id:id,
                        user:user
                    }
                }
            );
        } catch (error) {
            console.log(error,"context: checkContactIdExist")
            return null;
        }
    }

    async updateContactData(userId:string,id:string,name:string,email:string,phoneNumber:string):Promise<ContactData | null>{
        try {
            const user = await this.users.findOne({where:{id:userId}});

            if(!user){
                return null;
            }

            const updateResult = await this.contacts.update(id,{
                name:name,
                phoneNumber:phoneNumber,
                email:email
            })

            if(updateResult.affected === 0){
                return null;
            }

            const newData:ContactData ={
                id,
                name,
                phoneNumber,
                email
            } 
            return newData;
        } catch (error) {
            console.log(error,"context: updateContactData")
            return null;
        }
    }

    async createContact(userId:string,name:string,phoneNumber:string,email:string):Promise<ContactData | null>{
        try {
            const user = await this.users.findOne({where:{id:userId}})

            if(!user){
                return null
            }

            const save = await this.contacts.save({user,name,phoneNumber,email});
            return this.contactDataMapper(save);
        } catch (error) {
            console.log(error,"context: createContact")
            return null;
        }
    }

    async listContactsPaginated(userId:string,page:number,quantity:number):Promise<ContactData[] | null>{
        try {
            const user = await this.users.findOne({where:{id:userId}});

            if(!user){
                return null;
            }

            const listResponse = await this.contacts.find(
                {
                    where:{user:user},
                    skip:page,
                    take:quantity,
                    order:{createdAt:'DESC'}
                }
            )

            return listResponse.map(contact => this.contactDataMapper(contact));

        } catch (error) {
            console.log(error,"context: listContactsPaginated")
            return null;
        }
    }

    contactDataMapper(contact:ContactEntity):ContactData{
        const contactData:ContactData = {
            id:contact.id,
            name:contact.name,
            phoneNumber:contact.phoneNumber,
            email:contact.email
        }
        return contactData;
    }
}