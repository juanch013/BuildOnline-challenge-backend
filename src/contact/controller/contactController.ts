import { InternalError } from "../../../common/errors/errors";
import MyJwtPayload from "../../../common/types/modifyesTypes/jwtPayload";
import { IRequest } from "../../../common/types/modifyesTypes/modifyedRequest";
import { UpdateContactDto } from "../dtos/updateContactDto";
import IContactController from "../interfaces/contactController";
import { ContactData } from "../interfaces/contactData";
import { IContactService } from "../interfaces/contactService";
import {Request,Response} from 'express';

export default class contactController implements IContactController{
    constactService:IContactService
    constructor(constactService:IContactService){
        this.constactService = constactService;
    }

    async createContact(req:IRequest,res:Response): Promise<Response> {
        try {
            const {id} = req.loggedUser as MyJwtPayload;
            const createContactResponse = await this.constactService.createContact(id,req.body);
            return res.status(createContactResponse.code).json(createContactResponse);
        } catch (error) {
            console.log(error,"context: createContact")
            return res.status(InternalError.code).json(InternalError)
        }
    }

    async getContact(req:Request,res:Response): Promise<Response> {
        try {
            const {contactId} = req.params
            const getContactResponse = await this.constactService.getContact(contactId);
            return res.status(getContactResponse.code).json(getContactResponse);
        } catch (error) {
            console.log(error,"context: getContact")
            return res.status(InternalError.code).json(InternalError)
        }
    }

    async updateContact(req:Request,res:Response): Promise<Response>{
        try {
            const {contactId} = req.params
            const body:UpdateContactDto = req.body

            const contactData:ContactData = {
                ...body,
                id:contactId
            }

            const updateResponse = await this.constactService.updateContact(contactData);
            return res.status(updateResponse.code).json(updateResponse);
        } catch (error) {
            console.log(error,"context: updateContact")
            return res.status(InternalError.code).json(InternalError)
        }
    }
}