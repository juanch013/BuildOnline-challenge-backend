import { noteData } from './../../../src/notes/interfaces/noteData';
import IUserRepository from "../../../src/repositories/interfaces/userRepository";
import LoginResponse from "../../../common/types/responses/loginResponse";
import { InternalError } from "../../../common/errors/errors";
import IContactRepository from '../../../src/repositories/interfaces/contactRepository';
import INoteRepository from "../../../src/repositories/interfaces/noteRepository";
import INoteService from '../../../src/notes/interfaces/noteService';
import NoteService from "../../../src/notes/service/noteService"
import CreateNoteResponse from '../../../common/types/responses/createNoteResponse';
import ListNotesResponse from '../../../common/types/responses/listNotesResponse';
import { error } from 'console';

jest.mock('jsonwebtoken');

const mockUserRepository: IUserRepository = {
    getUserByCredentials: jest.fn(),
    chekUserById: jest.fn(),
    getUserById: jest.fn(),
};

const mockContactRepository: IContactRepository = {
    createContact: jest.fn(),
    getContactById: jest.fn(),
    updateContactData: jest.fn(),
    listContactsPaginated: jest.fn(),
    checkEmailExist: jest.fn(),
    checkContactIdExistForUser: jest.fn(),
};

const mockNoteRepository: INoteRepository = {
    createNote: jest.fn(),
    listNotesPaginated: jest.fn(),
    getNotebById: jest.fn(),
    checkNoteOwner: jest.fn(),
}

describe('NoteService - create note', () => {
    let noteService: INoteService;

    beforeEach(() => {
        noteService = new NoteService(mockNoteRepository,mockUserRepository,mockContactRepository);
        jest.clearAllMocks();
    });

    it('should return CreateNoteResponse with note data in it', async () => {
        const mockNoteData:noteData = {
            id:"84635bee-03c3-42a2-807e-4c7bdc8aba62",
            note:"note 1",
            createdAt:"2024-08-25 01:58:55.981759"
        }
        const expectedResponse: CreateNoteResponse = {
            code:200,
            message:"Note created successfully",
            data:mockNoteData
        };

        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const contactId = "ff50d2ab-86f5-44a4-91d1-8fc80039b7ed";

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkContactIdExistForUser as jest.Mock).mockResolvedValue(true);
        (mockNoteRepository.createNote as jest.Mock).mockResolvedValue(mockNoteData);

        const result = await noteService.createNote(userId,contactId,mockNoteData.note);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.checkContactIdExistForUser).toHaveBeenCalledWith(userId,contactId);
        expect(mockNoteRepository.createNote).toHaveBeenCalledWith(contactId,mockNoteData.note);
        
        expect(result).toEqual(expectedResponse);
    });

    it('should return user invalid when user do not exist', async () => {

        const mockExpectedResponse: CreateNoteResponse = {
            code:400,
            message:"user invalid",
            data:{}
        };

        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const contactId = "ff50d2ab-86f5-44a4-91d1-8fc80039b7ed";
        const note = "note 1";

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(false);
        (mockContactRepository.checkContactIdExistForUser as jest.Mock).mockResolvedValue(true);

        const result = await noteService.createNote(userId,contactId,note);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        
        expect(result).toEqual(mockExpectedResponse);
    });

    it('should return 400 when contact do not belong to logged user', async () => {
        const mockExpectedResponse: CreateNoteResponse = {
            code:400,
            message:"contact does not exist for logged user",
            data:{}
        };

        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const contactId = "ff50d2ab-86f5-44a4-91d1-8fc80039b7ed";
        const note = "note 1";

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkContactIdExistForUser as jest.Mock).mockResolvedValue(false);

        const result = await noteService.createNote(userId,contactId,note);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.checkContactIdExistForUser).toHaveBeenCalledWith(userId,contactId);

        expect(result).toEqual(mockExpectedResponse);
    });

    it('should return 500 when error creating note', async () => {
        const mockExpectedResponse: CreateNoteResponse = {
            code:500,
            message:"error creating note",
            data:{}
        };

        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const contactId = "ff50d2ab-86f5-44a4-91d1-8fc80039b7ed";
        const note = "note 1";

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkContactIdExistForUser as jest.Mock).mockResolvedValue(true);
        (mockNoteRepository.createNote as jest.Mock).mockResolvedValue(null);


        const result = await noteService.createNote(userId,contactId,note);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.checkContactIdExistForUser).toHaveBeenCalledWith(userId,contactId);

        expect(result).toEqual(mockExpectedResponse);
    });

    it('should return Internal error when an error occurs', async () => {
        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const contactId = "ff50d2ab-86f5-44a4-91d1-8fc80039b7ed";
        const note = "note 1";

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockContactRepository.checkContactIdExistForUser as jest.Mock).mockResolvedValue(true);
        (mockNoteRepository.createNote as jest.Mock).mockRejectedValue(new Error());

        const result = await noteService.createNote(userId,contactId,note);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockContactRepository.checkContactIdExistForUser).toHaveBeenCalledWith(userId,contactId);

        expect(result).toEqual(InternalError);
    });
});

describe('noteService - LisNotesPaginated', () => {
    let noteService: INoteService;

    beforeEach(() => {
        noteService = new NoteService(mockNoteRepository,mockUserRepository,mockContactRepository);
        jest.clearAllMocks();
    });
    
    it('should return ListNotesResponse with notes data in it', async () => {
        const mockNotesData:noteData[] = [
            {
                id:"84635bee-03c3-42a2-807e-4c7bdc8aba62",
                note:"note 1",
                createdAt:"2024-08-25 01:58:55.981759"
            },
            {
                id:"84635bee-03c3-42a2-807e-4c7bdc8aba34",
                note:"note 2",
                createdAt:"2024-08-26 01:58:55.981759"
            }
        ]

        const expectedResponse: ListNotesResponse = {
            code:200,
            message:"listed notes",
            data:mockNotesData,
        };

        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const page = 1;
        const quantity = 2;

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockNoteRepository.listNotesPaginated as jest.Mock).mockResolvedValue(mockNotesData);

        const result = await noteService.listNotesPaginated(userId,page,quantity);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockNoteRepository.listNotesPaginated).toHaveBeenCalledWith(userId,page,quantity);
        
        expect(result).toEqual(expectedResponse);
    });

    it('should return ListNotesResponse with notes data in it using default values for page and wuantity', async () => {
        const mockNotesData:noteData[] = [
            {
                id:"84635bee-03c3-42a2-807e-4c7bdc8aba62",
                note:"note 1",
                createdAt:"2024-08-25 01:58:55.981759"
            },
            {
                id:"84635bee-03c3-42a2-807e-4c7bdc8aba34",
                note:"note 2",
                createdAt:"2024-08-26 01:58:55.981759"
            }
        ]

        const expectedResponse: ListNotesResponse = {
            code:200,
            message:"listed notes",
            data:mockNotesData,
        };

        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockNoteRepository.listNotesPaginated as jest.Mock).mockResolvedValue(mockNotesData);

        const result = await noteService.listNotesPaginated(userId,Number("a"),Number("a"));

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockNoteRepository.listNotesPaginated).toHaveBeenCalledWith(userId,1,10);
        
        expect(result).toEqual(expectedResponse);
    });

    it('should return 400 when user do not exist', async () => {
        const expectedResponse: ListNotesResponse = {
            code:400,
            message:"user invalid",
            data:{},
        };

        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const page = 1;
        const quantity = 2;

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(false);

        const result = await noteService.listNotesPaginated(userId,page,quantity);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        
        expect(result).toEqual(expectedResponse);
    });

    it('should return 500 when error occurs listing the notes', async () => {
        const expectedResponse: ListNotesResponse = {
            code:500,
            message:"error listing notes",
            data:{},
        };

        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const page = 1;
        const quantity = 2;

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockNoteRepository.listNotesPaginated as jest.Mock).mockResolvedValue(null);

        const result = await noteService.listNotesPaginated(userId,page,quantity);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockNoteRepository.listNotesPaginated).toHaveBeenCalledWith(userId,page,quantity);
        
        expect(result).toEqual(expectedResponse);
    });

    it('should return Interal error when error occurs listing the notes', async () => {
        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const page = 1;
        const quantity = 2;

        (mockUserRepository.chekUserById as jest.Mock).mockResolvedValue(true);
        (mockNoteRepository.listNotesPaginated as jest.Mock).mockRejectedValue(new Error());

        const result = await noteService.listNotesPaginated(userId,page,quantity);

        expect(mockUserRepository.chekUserById).toHaveBeenCalledWith(userId);
        expect(mockNoteRepository.listNotesPaginated).toHaveBeenCalledWith(userId,page,quantity);
        
        expect(result).toEqual(InternalError);
    });

    
});

describe('NoteService - getNoteById', () => {
    let noteService: INoteService;

    beforeEach(() => {
        noteService = new NoteService(mockNoteRepository,mockUserRepository,mockContactRepository);
        jest.clearAllMocks();
    });

    it('should return CreateNoteResponse with note data in it', async () => {
        const mockNoteData:noteData = {
            id:"84635bee-03c3-42a2-807e-4c7bdc8aba62",
            note:"note 1",
            createdAt:"2024-08-25 01:58:55.981759"
        }
        const expectedResponse: CreateNoteResponse = {
            code:200,
            message:"note detail",
            data:mockNoteData
        };

        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const noteId = "ff50d2ab-86f5-44a4-91d1-8fc80039b7ed";

        (mockNoteRepository.checkNoteOwner as jest.Mock).mockResolvedValue(true);
        (mockNoteRepository.getNotebById as jest.Mock).mockResolvedValue(mockNoteData);

        const result = await noteService.getNoteById(userId,noteId)

        expect(mockNoteRepository.checkNoteOwner).toHaveBeenCalledWith(userId,noteId);
        expect(mockNoteRepository.getNotebById).toHaveBeenCalledWith(userId,noteId);
        
        expect(result).toEqual(expectedResponse);
    });

    it('should return CreateNoteResponse with note data in it', async () => {
        const expectedResponse: CreateNoteResponse = {
            code:400,
            message:"logged user does not own the note",
            data:{}
        };

        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const noteId = "ff50d2ab-86f5-44a4-91d1-8fc80039b7ed";

        (mockNoteRepository.checkNoteOwner as jest.Mock).mockResolvedValue(false);

        const result = await noteService.getNoteById(userId,noteId)

        expect(mockNoteRepository.checkNoteOwner).toHaveBeenCalledWith(userId,noteId);
        
        expect(result).toEqual(expectedResponse);
    });

    it('should return InternalError when an error occurs', async () => {
        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const noteId = "ff50d2ab-86f5-44a4-91d1-8fc80039b7ed";

        (mockNoteRepository.checkNoteOwner as jest.Mock).mockResolvedValue(true);
        (mockNoteRepository.getNotebById as jest.Mock).mockRejectedValue(new Error());

        const result = await noteService.getNoteById(userId,noteId)

        expect(mockNoteRepository.checkNoteOwner).toHaveBeenCalledWith(userId,noteId);
        expect(mockNoteRepository.getNotebById).toHaveBeenCalledWith(userId,noteId);
        
        expect(result).toEqual(InternalError);
    });

    it('should return InternalError when an error occurs', async () => {
        const expectedResponse: CreateNoteResponse = {
            code:500,
            message:"error getting note detail",
            data:{}
        };
        
        const userId = "d87f0351-59de-4236-a77f-c4dcf87d099d";
        const noteId = "ff50d2ab-86f5-44a4-91d1-8fc80039b7ed";

        (mockNoteRepository.checkNoteOwner as jest.Mock).mockResolvedValue(true);
        (mockNoteRepository.getNotebById as jest.Mock).mockResolvedValue(null);

        const result = await noteService.getNoteById(userId,noteId)

        expect(mockNoteRepository.checkNoteOwner).toHaveBeenCalledWith(userId,noteId);
        expect(mockNoteRepository.getNotebById).toHaveBeenCalledWith(userId,noteId);
        
        expect(result).toEqual(expectedResponse);
    });
});