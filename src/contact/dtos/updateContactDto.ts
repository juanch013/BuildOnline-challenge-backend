import { IsEmail, IsNotEmpty, IsNumberString, IsString, Length, MinLength } from "class-validator"

export class UpdateContactDto{
    @IsNotEmpty()
    @IsString()
    name!:string

    @IsNotEmpty()
    @IsString()
    @IsNumberString()
    @Length(9)
    phoneNumber!:string

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email!:string
}