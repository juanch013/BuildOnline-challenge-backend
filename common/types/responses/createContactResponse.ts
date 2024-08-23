import { ContactData } from '../../../src/contact/interfaces/contactData';
import { BaseResponse } from './BaseResponse';

export default interface CreateContactResponse extends BaseResponse<ContactData | {}>{}