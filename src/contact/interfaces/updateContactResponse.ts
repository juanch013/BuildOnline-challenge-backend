import { BaseResponse } from "../../../common/types/responses/BaseResponse";
import { ContactData } from "./contactData";

export interface UpdateContactResponse extends BaseResponse<ContactData | {} >{}