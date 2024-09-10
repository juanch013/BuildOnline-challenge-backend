import { contactService } from './../../../src/contact/services/contactService';
import NoteController from './../../../src/notes/controller/noteController';
import { Request, Response } from 'express';
import { IRequest } from '../../../common/types/modifyesTypes/modifyedRequest';
import INoteService from '../../../src/notes/interfaces/noteService'
import CreateNoteResponse from '../../../common/types/responses/createNoteResponse';
import CreateNoteDto from '../../../src/contact/dtos/createNoteDto';
import MyJwtPayload from '../../../common/types/modifyesTypes/jwtPayload';
import { InternalError } from '../../../common/errors/errors';
import contactController from '../../../src/contact/controller/contactController';
import IContactController from '../../../src/contact/interfaces/contactController';
import { IContactService } from '../../../src/contact/interfaces/contactService';
import CreateContactResponse from '../../../common/types/responses/createContactResponse';
import { CreateContactDto } from '../../../src/contact/dtos/createContactDto';
import GetContactResponse from '../../../common/types/responses/getContactResponse';
import { UpdateContactResponse } from '../../../common/types/responses/updateContactResponse';
import { UpdateContactDto } from '../../../src/contact/dtos/updateContactDto';

const mockContactService: IContactService = {
    listContacts:jest.fn(),
    createContact:jest.fn(),
    updateContact:jest.fn(),
    getContact:jest.fn()
};

const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (body: any,params:any,loggedUser:MyJwtPayload,query:any): Partial<IRequest> => {
    const req: Partial<IRequest> = { body, params ,loggedUser,query};
    return req;
};

describe('ContactController - createContact', () => {
    let contactControl: IContactController;
    let req: Partial<IRequest>;
    let res: Partial<Response>;

    beforeEach(() => {
        contactControl = new contactController(mockContactService);
        let loggedUser = { id: '123',email:"user1" } as MyJwtPayload, 
        req = mockRequest({},{},loggedUser,{});
        res = mockResponse();
    });

    it('should return contact data after creation', async () => {
        const mockCreateContactData:CreateContactResponse = {
            code:201,
            message:"Contact created successfully",
            data:{
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"fb3a6abd-f7bd-41c6-9ead-58722f1a6747"
            }
        };

        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const mockCreateContactDto:CreateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        };
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest(mockCreateContactDto,{},mockLoggedUser,{});

        (mockContactService.createContact as jest.Mock).mockResolvedValue(mockCreateContactData);

        await contactControl.createContact(req as IRequest, res as Response);

        expect(mockContactService.createContact).toHaveBeenCalledWith(userId,mockCreateContactDto);
        
        expect(res.status).toHaveBeenCalledWith(mockCreateContactData.code);
        expect(res.json).toHaveBeenCalledWith(mockCreateContactData);
    });

    it('should return internal error when service return unexpected value', async () => {
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"

        const mockCreateContactDto:CreateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        };

        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest(mockCreateContactDto,{},mockLoggedUser,{});

        (mockContactService.createContact as jest.Mock).mockResolvedValue(null);

        await contactControl.createContact(req as IRequest, res as Response);

        expect(mockContactService.createContact).toHaveBeenCalledWith(userId,mockCreateContactDto);
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

    it('should return Internall error when service failes and returns it', async () => {
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const mockCreateContactDto:CreateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        };
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest(mockCreateContactDto,{},mockLoggedUser,{});

        (mockContactService.createContact as jest.Mock).mockResolvedValue(InternalError);

        await contactControl.createContact(req as IRequest, res as Response);

        expect(mockContactService.createContact).toHaveBeenCalledWith(userId,mockCreateContactDto);
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

});


describe('ContactController - getContact', () => {
    let contactControl: IContactController;
    let req: Partial<IRequest>;
    let res: Partial<Response>;

    beforeEach(() => {
        contactControl = new contactController(mockContactService);
        let loggedUser = { id: '123',email:"user1" } as MyJwtPayload, 
        req = mockRequest({},{},loggedUser,{});
        res = mockResponse();
    });

    it('should return contact data', async () => {
        const mockGetContactData:GetContactResponse = {
            code:200,
            message:"contact detail",
            data:{
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"fb3a6abd-f7bd-41c6-9ead-58722f1a6747"
            }
        };

        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"

        const mockUrlParams = {
            contactId:"8592eddd-5e2b-431a-89c6-eb8a88c99d93"
        }

        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest({},mockUrlParams,mockLoggedUser,{});

        (mockContactService.getContact as jest.Mock).mockResolvedValue(mockGetContactData);

        await contactControl.getContact(req as IRequest, res as Response);

        expect(mockContactService.getContact).toHaveBeenCalledWith(mockUrlParams.contactId);
        
        expect(res.status).toHaveBeenCalledWith(mockGetContactData.code);
        expect(res.json).toHaveBeenCalledWith(mockGetContactData);
    });

    it('should return internal error when service return unexpected value', async () => {

        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"

        const mockUrlParams = {
            contactId:"8592eddd-5e2b-431a-89c6-eb8a88c99d93"
        }

        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest({},mockUrlParams,mockLoggedUser,{});

        (mockContactService.getContact as jest.Mock).mockResolvedValue(null);

        await contactControl.getContact(req as IRequest, res as Response);

        expect(mockContactService.getContact).toHaveBeenCalledWith(mockUrlParams.contactId);
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

    it('should return Internall error when service failes and returns it', async () => {
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"

        const mockUrlParams = {
            contactId:"8592eddd-5e2b-431a-89c6-eb8a88c99d93"
        }

        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest({},mockUrlParams,mockLoggedUser,{});

        (mockContactService.getContact as jest.Mock).mockResolvedValue(InternalError);

        await contactControl.getContact(req as IRequest, res as Response);

        expect(mockContactService.getContact).toHaveBeenCalledWith(mockUrlParams.contactId);
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

});

describe('ContactController - updateContact', () => {
    let contactControl: IContactController;
    let req: Partial<IRequest>;
    let res: Partial<Response>;

    beforeEach(() => {
        contactControl = new contactController(mockContactService);
        let loggedUser = { id: '123',email:"user1" } as MyJwtPayload, 
        req = mockRequest({},{},loggedUser,{});
        res = mockResponse();
    });

    it('should return contact data after update', async () => {
        const mockUpdateContactData:UpdateContactResponse = {
            code:200,
            message:"contact updated successfully",
            data:{
                name:"contact 1",
                email:"contact1@gmail.com",
                phoneNumber:"099111222",
                id:"fb3a6abd-f7bd-41c6-9ead-58722f1a6747"
            }
        };

        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const mockupdateContactDto:UpdateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        };
        const contactId = "fb3a6abd-f7bd-41c6-9ead-58722f1a6747" 
        const mockUrlParams = {
            contactId
        }
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest(mockupdateContactDto,mockUrlParams,mockLoggedUser,{});

        (mockContactService.updateContact as jest.Mock).mockResolvedValue(mockUpdateContactData);

        await contactControl.updateContact(req as IRequest, res as Response);

        expect(mockContactService.updateContact).toHaveBeenCalledWith(userId,{...mockupdateContactDto,id:contactId});
        
        expect(res.status).toHaveBeenCalledWith(mockUpdateContactData.code);
        expect(res.json).toHaveBeenCalledWith(mockUpdateContactData);
    });

    it('should return internal error when service return unexpected value', async () => {
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const mockupdateContactDto:UpdateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        };
        const contactId = "fb3a6abd-f7bd-41c6-9ead-58722f1a6747" 
        const mockUrlParams = {
            contactId
        }
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest(mockupdateContactDto,mockUrlParams,mockLoggedUser,{});

        (mockContactService.updateContact as jest.Mock).mockResolvedValue(null);

        await contactControl.updateContact(req as IRequest, res as Response);

        expect(mockContactService.updateContact).toHaveBeenCalledWith(userId,{...mockupdateContactDto,id:contactId});
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

    it('should return Internall error when service failes and returns it', async () => {
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const mockupdateContactDto:UpdateContactDto = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222"
        };
        const contactId = "fb3a6abd-f7bd-41c6-9ead-58722f1a6747" 
        const mockUrlParams = {
            contactId
        }
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest(mockupdateContactDto,mockUrlParams,mockLoggedUser,{});

        (mockContactService.updateContact as jest.Mock).mockResolvedValue(InternalError);

        await contactControl.updateContact(req as IRequest, res as Response);

        expect(mockContactService.updateContact).toHaveBeenCalledWith(userId,{...mockupdateContactDto,id:contactId});
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

});

describe('ContactController - listContact', () => {
    let contactControl: IContactController;
    let req: Partial<IRequest>;
    let res: Partial<Response>;

    beforeEach(() => {
        contactControl = new contactController(mockContactService);
        let loggedUser = { id: '123',email:"user1" } as MyJwtPayload, 
        req = mockRequest({},{},loggedUser,{});
        res = mockResponse();
    });

    it('should return list of contacts', async () => {
        const mockGetContactData:UpdateContactResponse = {
            code:200,
            message:"List contacts for logged in user",
            data:[
                {
                    name:"contact 1",
                    email:"contact1@gmail.com",
                    phoneNumber:"099111222",
                    id:"fb3a6abd-f7bd-41c6-9ead-58722f1a6747"
                },
                {
                    name:"contact 2",
                    email:"contact2@gmail.com",
                    phoneNumber:"099111333",
                    id:"fb3a6abd-f7bd-41c6-9ead-58722f1a6759"
                }
            ]
        };

        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const page = "2" 
        const quantity = "2" 
        const mockQueryParams = {
            page,quantity
        }
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest({},{},mockLoggedUser,mockQueryParams);

        (mockContactService.listContacts as jest.Mock).mockResolvedValue(mockGetContactData);

        await contactControl.listContacts(req as IRequest, res as Response);

        expect(mockContactService.listContacts).toHaveBeenCalledWith(userId,Number(mockQueryParams.page),Number(mockQueryParams.quantity));
        
        expect(res.status).toHaveBeenCalledWith(mockGetContactData.code);
        expect(res.json).toHaveBeenCalledWith(mockGetContactData);
    });

    it('should return internal error when service return unexpected value', async () => {
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const page = "2" 
        const quantity = "2" 
        const mockQueryParams = {
            page,quantity
        }
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest({},{},mockLoggedUser,mockQueryParams);

        (mockContactService.listContacts as jest.Mock).mockResolvedValue(null);

        await contactControl.listContacts(req as IRequest, res as Response);

        expect(mockContactService.listContacts).toHaveBeenCalledWith(userId,Number(mockQueryParams.page),Number(mockQueryParams.quantity));
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

    it('should return Internall error when service failes and returns it', async () => {

        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const page = "2" 
        const quantity = "2" 
        const mockQueryParams = {
            page,quantity
        }
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            email:"usuario 1"
        };

        req = mockRequest({},{},mockLoggedUser,mockQueryParams);

        (mockContactService.listContacts as jest.Mock).mockResolvedValue(InternalError);

        await contactControl.listContacts(req as IRequest, res as Response);

        expect(mockContactService.listContacts).toHaveBeenCalledWith(userId,Number(mockQueryParams.page),Number(mockQueryParams.quantity));
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

});