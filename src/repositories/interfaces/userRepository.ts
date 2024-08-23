import userData from "../../auth/interfaces/userData";

export default interface IUserRepository{
    getUserByCredentials(username:string,password:string):Promise<userData|null>
    chekUserById(id:string):Promise<boolean|null>
}