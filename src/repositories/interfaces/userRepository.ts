import userData from "../../auth/interfaces/userData";

export default interface IUserRepository{
    getUserByCredentials(email:string,password:string):Promise<userData|null>
    chekUserById(id:string):Promise<boolean|null>
    getUserById(id:string):Promise<userData | null>
}