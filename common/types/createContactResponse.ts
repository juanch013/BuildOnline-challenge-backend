import { BaseResponse } from './BaseResponse';

export interface CreateContactData {
    name:String,
    email:String,
    phoneNumber:String,
}

export default interface CreateContactResponse extends BaseResponse<CreateContactData | {}>{}