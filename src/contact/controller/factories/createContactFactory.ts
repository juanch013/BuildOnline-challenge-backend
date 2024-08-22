import { Request,Response } from 'express';
import { contactRepository } from '../../../repositories/repositories/contactRepository';
import { contactService } from '../../services/contactService';
import contactController from '../contactController';

const createContactFactory = (req:Request,res:Response) => {
    const contactRepo = new contactRepository();
    const contactServ = new contactService(contactRepo);
    const authCon = new contactController(contactServ)
    return authCon.createContact(req,res);
};

export default createContactFactory;