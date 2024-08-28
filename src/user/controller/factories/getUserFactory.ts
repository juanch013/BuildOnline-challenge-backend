import { Request,Response } from 'express';
import { userRepository } from '../../../repositories/repositories/userRepository';
import UserService from '../../service/userService';
import UserController from '../userController';

const getUserFactory = (req:Request,res:Response) => {
    const userRepo = new userRepository();
    const userServ = new UserService(userRepo);
    const userController = new UserController(userServ);
    return userController.getUser(req,res);
};

export default getUserFactory;