import { InternalError } from './../../../common/errors/errors';
import IUserRepository from "../../repositories/interfaces/userRepository";
import GetUserResponse from "../../../common/types/responses/getUserResponse";
import IUserService from '../interfaces/userService';

export default class UserService implements IUserService{
    private user:IUserRepository
    constructor(userRepo:IUserRepository){
        this.user = userRepo;
    }

    async getUserData(userId:string):Promise<GetUserResponse>{
        try {   
            const getUser = await this.user.getUserById(userId)
            
            if(!getUser){
                const errorResponse:GetUserResponse = {
                    code:400,
                    message:"user does not exist",
                    data:{}
                }
                return errorResponse
            }

            const response:GetUserResponse = {
                code:200,
                message:"user detail",
                data:getUser
            }
            return response

        } catch (error) {
            console.log(error,"context: getUserData")
            return InternalError;
        }
    }
}