import { UpdateContactDto } from './../../../src/contact/dtos/updateContactDto';
import { contactService } from './../../../src/contact/services/contactService';
import AuthService from "../../../src/auth/service/authService";
import IUserRepository from "../../../src/repositories/interfaces/userRepository";
import LoginResponse from "../../../common/types/responses/loginResponse";
import { LoginDto } from "../../../src/auth/dtos/loginDto";
import userData from "../../../src/auth/interfaces/userData";
import * as jwt from 'jsonwebtoken';
import { InternalError } from "../../../common/errors/errors";
import { IContactService } from '../../../src/contact/interfaces/contactService';
import IContactRepository from '../../../src/repositories/interfaces/contactRepository';
import { ListContactsResponse } from '../../../common/types/responses/listContactsResponse';
import { ContactData } from '../../../src/contact/interfaces/contactData';
import { CreateContactDto } from '../../../src/contact/dtos/createContactDto';
import GetContactResponse from '../../../common/types/responses/getContactResponse';

jest.mock('jsonwebtoken');

const mockContactRepository: IContactRepository = {
    createContact: jest.fn(),
    checkEmailExist: jest.fn(),
    getContactById: jest.fn(),
    checkContactIdExistForUser: jest.fn(),
    updateContactData: jest.fn(),
    listContactsPaginated: jest.fn(),
};

const mockUserRepository: IUserRepository = {
    getUserByCredentials: jest.fn(),
    chekUserById: jest.fn(),
    getUserById: jest.fn(),
}

describe('ContactService - listContactPaginated', () => {
    let contactServ: IContactService;

    beforeEach(() => {
        contactServ = new contactService(mockContactRepository,mockUserRepository);
        jest.clearAllMocks();
    });

    it('should return List of contacts for the user logged in', async () => {

        const mockContactsData: ContactData[] = [
            {
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
            },
            {
                name:"contact 2",
                email:"contact2@gmail.com",
                phoneNumber:"099111333",
                id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5"
            }
        ]
        const page = 1
        const quantity = 5
        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
            code:200,
            message:"List contacts for logged in user",
            data:mockContactsData
        };



        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.listContactsPaginated as jest.Mock).mockResolvedValue(mockContactsData);


        const result = await contactServ.listContacts(userId,page,quantity);

        expect(mockContactRepository.listContactsPaginated).toHaveBeenCalledWith(userId,page,quantity);
        expect(result).toEqual(expectedResponse);
    });

    it('should return List of contacts for the user logged in using default values for page and quantity', async () => {

        const mockContactsData: ContactData[] = [
            {
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
            },
            {
                name:"contact 2",
                email:"contact2@gmail.com",
                phoneNumber:"099111333",
                id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5"
            }
        ]

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
            code:200,
            message:"List contacts for logged in user",
            data:mockContactsData
        };



        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.listContactsPaginated as jest.Mock).mockResolvedValue(mockContactsData);


        const result = await contactServ.listContacts(userId,Number("a"),Number("a"));

        expect(mockContactRepository.listContactsPaginated).toHaveBeenCalledWith(userId,1,10);
        expect(result).toEqual(expectedResponse);
    });

    it('should return 400 when userId do not exist', async () => {
        const page = 1
        const quantity = 5
        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
            code:400,
            message:"invalid user",
            data:{}
        };

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(false);

        const result = await contactServ.listContacts(userId,page,quantity);

        expect(result).toEqual(expectedResponse);
    });

    it('should return 500 when error occurs when listing contacts', async () => {
        const page = 1
        const quantity = 5
        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
            code:500,
            message:"error listing contacts",
            data:{}
        };

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.listContactsPaginated as jest.Mock).mockResolvedValue(null);

        const result = await contactServ.listContacts(userId,page,quantity);

        expect(result).toEqual(expectedResponse);
    });

    it('should return 500 when error occurs when listing contacts', async () => {
        const page = 1
        const quantity = 5
        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        (mockUserRepository.chekUserById as jest.Mock).mockRejectedValue(new Error());

        const result = await contactServ.listContacts(userId,page,quantity);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(result).toEqual(InternalError);
    });
});

describe('ContactService - createContact', () => {
    let contactServ: IContactService;

    beforeEach(() => {
        contactServ = new contactService(mockContactRepository,mockUserRepository);
        jest.clearAllMocks();
    });

    it('should create a contact and return the contact data', async () => {
        const mockCreateContactDto:CreateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        }

        const mockContactsData: ContactData = {
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
            }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
            code:201,
            message:"Contact created successfully",
            data:mockContactsData
        };

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkEmailExist as jest.Mock).mockResolvedValue(false);
        (mockContactRepository.createContact as jest.Mock).mockResolvedValue(mockContactsData);

        const result = await contactServ.createContact(userId,mockCreateContactDto);

        expect(mockContactRepository.checkEmailExist).toHaveBeenCalledWith(userId,mockCreateContactDto.email);
        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.createContact).toHaveBeenCalledWith(userId,mockCreateContactDto.name,mockCreateContactDto.phoneNumber,mockCreateContactDto.email)

        expect(result).toEqual(expectedResponse);
    });

    it('should return 400 when userId do not exist', async () => {
        const mockCreateContactDto:CreateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
            code:400,
            message:"invalid user",
            data:{}
        };

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(false);

        const result = await contactServ.createContact(userId,mockCreateContactDto);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);

        expect(result).toEqual(expectedResponse);
    });

    it('should return 400 when email is registered in other contact for logged user', async () => {
        const mockCreateContactDto:CreateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
             code:400,
            message:"email is already registered in other contact",
            data:{}
        };

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkEmailExist as jest.Mock).mockResolvedValue(true);

        const result = await contactServ.createContact(userId,mockCreateContactDto);

        expect(mockContactRepository.checkEmailExist).toHaveBeenCalledWith(userId,mockCreateContactDto.email);
        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);

        expect(result).toEqual(expectedResponse);
    });

    it('should return 500 when an error occurs while creating a contact', async () => {
        
        const mockCreateContactDto:CreateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";


        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkEmailExist as jest.Mock).mockResolvedValue(false);
        (mockContactRepository.createContact as jest.Mock).mockResolvedValue(null);

        const result = await contactServ.createContact(userId,mockCreateContactDto);

        expect(mockContactRepository.checkEmailExist).toHaveBeenCalledWith(userId,mockCreateContactDto.email);
        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.createContact).toHaveBeenCalledWith(userId,mockCreateContactDto.name,mockCreateContactDto.phoneNumber,mockCreateContactDto.email)

        expect(result).toEqual(InternalError);
    });

    it('should return 500 when an exception is handled', async () => {
        
        const mockCreateContactDto:CreateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";


        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkEmailExist as jest.Mock).mockResolvedValue(false);
        (mockContactRepository.createContact as jest.Mock).mockRejectedValue(new Error());

        const result = await contactServ.createContact(userId,mockCreateContactDto);

        expect(mockContactRepository.checkEmailExist).toHaveBeenCalledWith(userId,mockCreateContactDto.email);
        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.createContact).toHaveBeenCalledWith(userId,mockCreateContactDto.name,mockCreateContactDto.phoneNumber,mockCreateContactDto.email)

        expect(result).toEqual(InternalError);
    });
});

describe('ContactService - updateContact', () => {
    let contactServ: IContactService;

    beforeEach(() => {
        contactServ = new contactService(mockContactRepository,mockUserRepository);
        jest.clearAllMocks();
    });

    it('should update a contact and return the contact data', async () => {
        const mockContactsData: ContactData = {
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
            }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
            code:200,
            message:"contact updated successfully",
            data:mockContactsData
        };

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkContactIdExistForUser as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkEmailExist as jest.Mock).mockResolvedValue(false);
        (mockContactRepository.updateContactData as jest.Mock).mockResolvedValue(mockContactsData);

        const result = await contactServ.updateContact(userId,mockContactsData);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.checkContactIdExistForUser).toHaveBeenCalledWith(userId,mockContactsData.id);
        expect(mockContactRepository.checkEmailExist).toHaveBeenCalledWith(userId,mockContactsData.email)

        expect(result).toEqual(expectedResponse);
    });

    it('should return 400 when the email already exist for other contact', async () => {

        const mockContactsData: ContactData = {
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
            }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
            code:400,
            message:"email is in use by other contact",
            data:{}
        };

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkContactIdExistForUser as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkEmailExist as jest.Mock).mockResolvedValue(true);

        const result = await contactServ.updateContact(userId,mockContactsData);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.checkContactIdExistForUser).toHaveBeenCalledWith(userId,mockContactsData.id);
        expect(mockContactRepository.checkEmailExist).toHaveBeenCalledWith(userId,mockContactsData.email)

        expect(result).toEqual(expectedResponse);
    });

    it('should return 400 when contact does not exist for logged user', async () => {

        const mockContactsData: ContactData = {
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
            }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
            code:400,
            message:"contact does not exist",
            data:{}
        };

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkContactIdExistForUser as jest.Mock).mockResolvedValue(false);

        const result = await contactServ.updateContact(userId,mockContactsData);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.checkContactIdExistForUser).toHaveBeenCalledWith(userId,mockContactsData.id);

        expect(result).toEqual(expectedResponse);
    });

    it('should return 400 when user id do not exist', async () => {

        const mockContactsData: ContactData = {
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
            }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: ListContactsResponse = {
            code:400,
            message:"invalid user",
            data:{}
        };
        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(false);
        const result = await contactServ.updateContact(userId,mockContactsData);
        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);

        expect(result).toEqual(expectedResponse);
    });

    it('should return 500 when exeption is handled', async () => {

        const mockContactsData: ContactData = {
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
            }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

    
        (mockUserRepository.chekUserById as jest.Mock).mockRejectedValue(new Error());
        const result = await contactServ.updateContact(userId,mockContactsData);
        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);

        expect(result).toEqual(InternalError);
    });

    it('should return internal error when an error occurs updating the contact', async () => {
        const mockContactsData: ContactData = {
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
            }

        const userId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkContactIdExistForUser as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkEmailExist as jest.Mock).mockResolvedValue(false);
        (mockContactRepository.updateContactData as jest.Mock).mockResolvedValue(null);

        const result = await contactServ.updateContact(userId,mockContactsData);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.checkContactIdExistForUser).toHaveBeenCalledWith(userId,mockContactsData.id);
        expect(mockContactRepository.checkEmailExist).toHaveBeenCalledWith(userId,mockContactsData.email)

        expect(result).toEqual(InternalError);
    });
});

describe('ContactService - getContact', () => {
    let contactServ: IContactService;

    beforeEach(() => {
        contactServ = new contactService(mockContactRepository,mockUserRepository);
        jest.clearAllMocks();
    });

    it('should get the contact and return the contact data', async () => {

        const mockContactsData: ContactData = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
        }

        const contactId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: GetContactResponse = {
            code:200,
            message:"contact detail",
            data:mockContactsData
        };

        (mockContactRepository.getContactById as jest.Mock).mockResolvedValue(mockContactsData);

        const result = await contactServ.getContact(contactId);

        expect(mockContactRepository.getContactById).toHaveBeenCalledWith(contactId)

        expect(result).toEqual(expectedResponse);
    });

    it('should get the contact and return the contact data', async () => {

        const contactId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        const expectedResponse: GetContactResponse = {
            code:404,
            message:"contact not found",
            data:{}
        };

        (mockContactRepository.getContactById as jest.Mock).mockResolvedValue(null);

        const result = await contactServ.getContact(contactId);

        expect(mockContactRepository.getContactById).toHaveBeenCalledWith(contactId)

        expect(result).toEqual(expectedResponse);
    });

    it('should get the contact and return the contact data', async () => {

        const contactId = "390dae8c-6603-4114-9711-1d0db47b1de8";

        (mockContactRepository.getContactById as jest.Mock).mockRejectedValue(new Error());

        const result = await contactServ.getContact(contactId);

        expect(mockContactRepository.getContactById).toHaveBeenCalledWith(contactId)

        expect(result).toEqual(InternalError);
    });

});