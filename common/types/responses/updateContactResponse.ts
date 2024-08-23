import { BaseResponse } from "./BaseResponse";
import { ContactData } from "../../../src/contact/interfaces/contactData";

export interface UpdateContactResponse extends BaseResponse<ContactData | {} >{}