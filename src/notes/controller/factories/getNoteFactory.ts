import { Request,Response } from 'express';
import { contactRepository } from '../../../repositories/repositories/contactRepository';
import { noteRepository } from '../../../repositories/repositories/noteRepository';
import NoteService from '../../service/noteService';
import { userRepository } from '../../../repositories/repositories/userRepository';
import NoteController from '../noteController';

const getNoteFactory = (req:Request,res:Response) => {
    const noteRepo = new noteRepository();
    const contactRepo = new contactRepository();
    const userRepo = new userRepository();
    const NoteServ = new NoteService(noteRepo,userRepo,contactRepo);
    const noteController = new NoteController(NoteServ);
    return noteController.getNoteById(req,res);
};

export default getNoteFactory;