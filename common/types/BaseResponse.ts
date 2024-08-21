import { Response, Send } from "express"

export interface BaseResponse<dataType>{
    code:number,
    message:string,
    data:dataType
}

