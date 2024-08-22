import { BaseResponse } from './BaseResponse';

 interface getContactData{
    name:string,
    email:string,
    phoneNumber:string,
    id:string
}

export default interface GetContactResponse extends BaseResponse<getContactData | {}>{}