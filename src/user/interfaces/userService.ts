import GetUserResponse from "../../../common/types/responses/getUserResponse";

export default interface IUserService{
    getUserData(userId:string):Promise<GetUserResponse>;
}