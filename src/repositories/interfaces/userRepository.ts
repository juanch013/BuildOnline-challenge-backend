import userData from "../../auth/interfaces/userData";

export interface UserRepository{
    getUserByCredentials(username:string,password:string):Promise<userData|null>
}