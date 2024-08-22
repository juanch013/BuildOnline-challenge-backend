import { InternalError } from "../../../common/errors/errors";
import IContactController from "../interfaces/contactController";
import { IContactService } from "../interfaces/contactService";
import {Request,Response} from 'express';

export default class contactController implements IContactController{
    constactService:IContactService
    constructor(constactService:IContactService){
        this.constactService = constactService;
    }

    async createContact(req:Request,res:Response): Promise<Response> {
        try {
            const createContactResponse = await this.constactService.createContact(req.body);
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
}