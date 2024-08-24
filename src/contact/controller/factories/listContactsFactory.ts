import { Request,Response } from 'express';
import { contactRepository } from '../../../repositories/repositories/contactRepository';
import { contactService } from '../../services/contactService';
import contactController from '../contactController';
import { userRepository } from '../../../repositories/repositories/userRepository';

const listContactFactory = (req:Request,res:Response) => {
    const contactRepo = new contactRepository();
    const userRepo = new userRepository();
    const contactServ = new contactService(contactRepo,userRepo);
    const contactCon = new contactController(contactServ)
    return contactCon.listContacts(req,res);
};

export default listContactFactory;