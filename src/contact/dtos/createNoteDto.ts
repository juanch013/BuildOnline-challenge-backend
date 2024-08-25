import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export default class CreateNoteDto{
    @IsString()
    @IsNotEmpty()
    note:string
}