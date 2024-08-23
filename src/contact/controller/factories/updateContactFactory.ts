import { Request,Response } from 'express';
import { contactRepository } from '../../../repositories/repositories/contactRepository';
import { contactService } from '../../services/contactService';
import contactController from '../contactController';

const updateContactFactory = (req:Request,res:Response) => {
    const contactRepo = new contactRepository();
    const contactServ = new contactService(contactRepo);
    const contactCon = new contactController(contactServ)
    return contactCon.updateContact(req,res);
};

export default updateContactFactory;