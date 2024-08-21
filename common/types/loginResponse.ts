import { BaseResponse } from "./BaseResponse";

interface LoginData{
    token:string
}

export default interface LoginResponse extends BaseResponse<LoginData | {} >{}