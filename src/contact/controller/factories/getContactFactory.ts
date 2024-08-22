import { Request,Response } from 'express';
import { contactRepository } from '../../../repositories/repositories/contactRepository';
import { contactService } from '../../services/contactService';
import contactController from '../contactController';

const getContactFactory = (req:Request,res:Response) => {
    const contactRepo = new contactRepository();
    const contactServ = new contactService(contactRepo);
    const contactCon = new contactController(contactServ)
    return contactCon.getContact(req,res);
};

export default getContactFactory;