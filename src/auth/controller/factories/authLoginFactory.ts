import { authController } from '../authController';
import { userRepository } from '../../../repositories/repositories/userRepository';
import AuthService from '../../service/authService';
import { Request,Response } from 'express';

const authLoginFactory = (req:Request,res:Response) => {
    const userRepo = new userRepository();
    const authService = new AuthService(userRepo);
    const authCon = new authController(authService)
    return authCon.login(req,res);
};

export default authLoginFactory;