import { InternalError } from './../../../common/errors/errors';
import { Response } from "express";
import { IRequest } from "../../../common/types/modifyesTypes/modifyedRequest";
import IUserService from "../interfaces/userService";
import MyJwtPayload from '../../../common/types/modifyesTypes/jwtPayload';
import IUserController from '../interfaces/userController';

export default class UserController implements IUserController{
    private userService:IUserService;

    constructor(users:IUserService){
        this.userService = users;
    }

    async getUser(req:IRequest,res:Response):Promise<Response>{
        try {
            const {id} = req.loggedUser as MyJwtPayload
            const getUser = await this.userService.getUserData(id)
            return res.status(getUser.code).json(getUser);
        } catch (error) {
            console.log(error,"context: getUser")
            return res.status(InternalError.code).json(InternalError);
        }
    }
}