import { ContactData } from './../../../src/contact/interfaces/contactData';
import { BaseResponse } from './BaseResponse';

export interface ListContactsResponse extends BaseResponse<ContactData[] | {} >{}