import { noteData } from "../../notes/interfaces/noteData"

export interface ContactData{
    name:string,
    email:string,
    phoneNumber:string,
    id:string
    note?:noteData[]
}