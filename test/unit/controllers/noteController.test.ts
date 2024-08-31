import NoteController from './../../../src/notes/controller/noteController';
import { Request, Response } from 'express';
import { IRequest } from '../../../common/types/modifyesTypes/modifyedRequest';
import INoteService from '../../../src/notes/interfaces/noteService'
import CreateNoteResponse from '../../../common/types/responses/createNoteResponse';
import CreateNoteDto from '../../../src/contact/dtos/createNoteDto';
import MyJwtPayload from '../../../common/types/modifyesTypes/jwtPayload';
import { InternalError } from '../../../common/errors/errors';

const mockNoteService: INoteService = {
    createNote:jest.fn(),
    listNotesPaginated:jest.fn(),
    getNoteById:jest.fn()
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

describe('NoteController - createNote', () => {
    let noteController: NoteController;
    let req: Partial<IRequest>;
    let res: Partial<Response>;

    beforeEach(() => {
        noteController = new NoteController(mockNoteService);
        let loggedUser = { id: '123',username:"user1" } as MyJwtPayload, 
        req = mockRequest({},{},loggedUser,{});
        res = mockResponse();
    });

    it('should return note data after creation', async () => {
        const mockCreateNoteData:CreateNoteResponse = {
            code:200,
            message:"listed notes",
            data:{
                id:"ed810faf-a00a-468f-b432-dee8e26694e6",
                note:"note 1",
                createdAt:"2024-08-25T04:58:55.981Z"
            }
        };

        const contId = "ed810faf-a00a-468f-b432-dee8e26694e2"
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const note = "note 1"
        const mockCreateNoteDto:CreateNoteDto = {
            note   
        };
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            username:"usuario 1"
        };

        req = mockRequest(mockCreateNoteDto,{contactId:contId},mockLoggedUser,{});

        (mockNoteService.createNote as jest.Mock).mockResolvedValue(mockCreateNoteData);

        await noteController.createNote(req as IRequest, res as Response);

        expect(mockNoteService.createNote).toHaveBeenCalledWith(userId,contId,note);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCreateNoteData);
    });

    it('should return internal error when service fails', async () => {
        const contId = "ed810faf-a00a-468f-b432-dee8e26694e2"
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const note = "note 1"
        const mockCreateNoteDto:CreateNoteDto = {
            note   
        };
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            username:"usuario 1"
        };

        req = mockRequest(mockCreateNoteDto,{contactId:contId},mockLoggedUser,{});

        (mockNoteService.createNote as jest.Mock).mockResolvedValue(InternalError);

        await noteController.createNote(req as IRequest, res as Response);

        expect(mockNoteService.createNote).toHaveBeenCalledWith(userId,contId,note);
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

    it('should return status 400 when contact do not exist for logged user', async () => {
        const mockCreateNoteData:CreateNoteResponse = {
            code:400,
            message:"contact does not exist for logged user",
            data:{}
        };

        const contId = "ed810faf-a00a-468f-b432-dee8e26694e2"
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const note = "note 1"
        const mockCreateNoteDto:CreateNoteDto = {
            note   
        };
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            username:"usuario 1"
        };

        req = mockRequest(mockCreateNoteDto,{contactId:contId},mockLoggedUser,{});

        (mockNoteService.createNote as jest.Mock).mockResolvedValue(mockCreateNoteData);

        await noteController.createNote(req as IRequest, res as Response);

        expect(mockNoteService.createNote).toHaveBeenCalledWith(userId,contId,note);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(mockCreateNoteData);
    });

    it('should return internal error when service return unexpected value', async () => {
        const contId = "ed810faf-a00a-468f-b432-dee8e26694e2"
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const note = "note 1"
        const mockCreateNoteDto:CreateNoteDto = {
            note   
        };
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            username:"usuario 1"
        };

        req = mockRequest(mockCreateNoteDto,{contactId:contId},mockLoggedUser,{});

        (mockNoteService.createNote as jest.Mock).mockResolvedValue(null);

        await noteController.createNote(req as IRequest, res as Response);

        expect(mockNoteService.createNote).toHaveBeenCalledWith(userId,contId,note);
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });
});

describe('NoteController - listNotes', () => {
    let noteController: NoteController;
    let req: Partial<IRequest>;
    let res: Partial<Response>;

    beforeEach(() => {
        noteController = new NoteController(mockNoteService);
        let loggedUser = { id: '123',username:"user1" } as MyJwtPayload, 
        req = mockRequest({},{},loggedUser,{});
        res = mockResponse();
    });

    it('should return an array with notes and status 200', async () => {
        const mockListNoteData:CreateNoteResponse = {
            code:200,
            message:"listed notes",
            data:[
                {
                    id:"ed810faf-a00a-468f-b432-dee8e26694e6",
                    note:"note 1",
                    createdAt:"2024-08-25T04:58:55.981Z"
                },{
                    id:"ed810faf-a00a-468f-b432-dee8e26694e4",
                    note:"note 2",
                    createdAt:"2024-08-26T04:58:55.981Z"
                }
            ]
        };

        const page = "1"
        const quantity = "2"
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"

        const mockQueryParams = {
            page,
            quantity
        };
        
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            username:"usuario 1"
        };

        req = mockRequest({},{},mockLoggedUser,mockQueryParams);

        (mockNoteService.listNotesPaginated as jest.Mock).mockResolvedValue(mockListNoteData);

        await noteController.listNotes(req as IRequest, res as Response);

        expect(mockNoteService.listNotesPaginated).toHaveBeenCalledWith(userId,Number(mockQueryParams.page),Number(mockQueryParams.quantity));
        
        expect(res.status).toHaveBeenCalledWith(mockListNoteData.code);
        expect(res.json).toHaveBeenCalledWith(mockListNoteData);
    });

    it('should return an error when service responds with an unexpected error', async () => {
        const page = "1"
        const quantity = "2"
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"

        const mockQueryParams = {
            page,
            quantity
        };
        
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            username:"usuario 1"
        };

        req = mockRequest({},{},mockLoggedUser,mockQueryParams);

        (mockNoteService.listNotesPaginated as jest.Mock).mockResolvedValue(null);

        await noteController.listNotes(req as IRequest, res as Response);

        expect(mockNoteService.listNotesPaginated).toHaveBeenCalledWith(userId,Number(mockQueryParams.page),Number(mockQueryParams.quantity));
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

    it('should return an internal error when service responds with internal error', async () => {
        const page = "1"
        const quantity = "2"
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"

        const mockQueryParams = {
            page,
            quantity
        };
        
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            username:"usuario 1"
        };

        req = mockRequest({},{},mockLoggedUser,mockQueryParams);

        (mockNoteService.listNotesPaginated as jest.Mock).mockResolvedValue(InternalError);

        await noteController.listNotes(req as IRequest, res as Response);

        expect(mockNoteService.listNotesPaginated).toHaveBeenCalledWith(userId,Number(mockQueryParams.page),Number(mockQueryParams.quantity));
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

});


describe('NoteController - getNoteById', () => {
    let noteController: NoteController;
    let req: Partial<IRequest>;
    let res: Partial<Response>;

    beforeEach(() => {
        noteController = new NoteController(mockNoteService);
        let loggedUser = { id: '123',username:"user1" } as MyJwtPayload, 
        req = mockRequest({},{},loggedUser,{});
        res = mockResponse();
    });

    it('should return note detail and status 200', async () => {
        const mockGetNoteData:CreateNoteResponse = {
            code:200,
            message:"note detail",
            data:{
                id:"ed810faf-a00a-468f-b432-dee8e26694e6",
                note:"note 1",
                createdAt:"2024-08-25T04:58:55.981Z"
            }
        };

        const noteId = "ed810faf-a00a-468f-b432-dee8e26694e2"
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const mockUrlPrams = {
            noteId   
        };
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            username:"usuario 1"
        };

        req = mockRequest({},mockUrlPrams,mockLoggedUser,{});

        (mockNoteService.getNoteById as jest.Mock).mockResolvedValue(mockGetNoteData);

        await noteController.getNoteById(req as IRequest, res as Response);

        expect(mockNoteService.getNoteById).toHaveBeenCalledWith(userId,noteId);
        
        expect(res.status).toHaveBeenCalledWith(mockGetNoteData.code);
        expect(res.json).toHaveBeenCalledWith(mockGetNoteData);
    });

    it('should Internal error when service resolve al unexpected value', async () => {
        const noteId = "ed810faf-a00a-468f-b432-dee8e26694e2"
        const userId = "ed810faf-a00a-468f-b432-dee8e2662222"
        const mockUrlPrams = {
            noteId   
        };
        const mockLoggedUser:MyJwtPayload = {
            id:userId,
            username:"usuario 1"
        };

        req = mockRequest({},mockUrlPrams,mockLoggedUser,{});

        (mockNoteService.getNoteById as jest.Mock).mockResolvedValue(null);

        await noteController.getNoteById(req as IRequest, res as Response);

        expect(mockNoteService.getNoteById).toHaveBeenCalledWith(userId,noteId);
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

});