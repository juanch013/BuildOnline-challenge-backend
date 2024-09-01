import { noteData } from './../../../src/notes/interfaces/noteData';
import IUserRepository from "../../../src/repositories/interfaces/userRepository";
import LoginResponse from "../../../common/types/responses/loginResponse";
import { InternalError } from "../../../common/errors/errors";
import IContactRepository from '../../../src/repositories/interfaces/contactRepository';
import INoteRepository from "../../../src/repositories/interfaces/noteRepository";
import INoteService from '../../../src/notes/interfaces/noteService';
import NoteService from "../../../src/notes/service/noteService"

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

    it('should return noteResponse with note data in it', async () => {
        const mockNoteData:noteData = {
            id:"84635bee-03c3-42a2-807e-4c7bdc8aba62",
            note:"note 1",
            createdAt:"2024-08-25 01:58:55.981759"
        }
        const expectedResponse: LoginResponse = {
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

        const mockExpectedResponse: LoginResponse = {
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
        const mockExpectedResponse: LoginResponse = {
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
        const mockExpectedResponse: LoginResponse = {
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

// describe('AuthService - createJwt', () => {
//     let authService: AuthService;

//     beforeEach(() => {
//         authService = new AuthService(mockUserRepository);
//         jest.clearAllMocks();
//     });

//     it('should return token', async () => {
//         const mockUserData: userData = {
//             username: "user1",
//             id: "84635bee-03c3-42a2-807e-4c7bdc8aba62"
//         };
//         jest.spyOn(jwt, 'sign').mockImplementation(() => {
//             throw new Error("JWT creation failed");
//         });

//         const result = authService.createJwt(mockUserData);
//         expect(jwt.sign).toHaveBeenCalledWith(mockUserData, expect.any(String), { expiresIn: '1h' });
//         expect(result).toBeNull();
//     });

//     it('should return unauthorized when credentials are incorrect', async () => {
//         const mockUserData: userData = {
//             username: "user1",
//             id: "84635bee-03c3-42a2-807e-4c7bdc8aba62"
//         };

//         const mockToken = "mocked-token";

//         jest.spyOn(jwt, 'sign').mockImplementation(() => {
//             return mockToken
//         });

//         const result = authService.createJwt(mockUserData);
//         expect(jwt.sign).toHaveBeenCalledWith(mockUserData, expect.any(String), { expiresIn: '1h' });
//         expect(result).toEqual(mockToken);
//     });
// });

// describe('AuthService - findUserByCredentials', () => {
//     let authService: AuthService; 

//     beforeEach(() => {
//         authService = new AuthService(mockUserRepository);
//         jest.clearAllMocks();
//     });

//     it('should return userData', async () => {
//         const mockLoginDto: LoginDto = {
//             username: "user1",
//             password: "84635bee"
//         };

//         const mockUserData: userData = {
//             username: "user1",
//             id: "84635bee-03c3-42a2-807e-4c7bdc8aba62"
//         };
    
//         (mockUserRepository.getUserByCredentials as jest.Mock).mockResolvedValue(mockUserData);
        

//         const result = await authService.findUserByCredentials(mockLoginDto.username,mockLoginDto.password);
//         expect(mockUserRepository.getUserByCredentials).toHaveBeenCalledWith(mockLoginDto.username,mockLoginDto.password);
//         expect(result).toBe(mockUserData);
//     });

//     it('should return null when credentials are incorrect', async () => {
//         const mockLoginDto: LoginDto = {
//             username: "user1",
//             password: "84635bee"
//         };

//         (mockUserRepository.getUserByCredentials as jest.Mock).mockResolvedValue(null);

//         const result = await authService.findUserByCredentials(mockLoginDto.username,mockLoginDto.password);
//         expect(mockUserRepository.getUserByCredentials).toHaveBeenCalledWith(mockLoginDto.username,mockLoginDto.password);
//         expect(result).toBe(null);
//     });

//     it('should return null when an errors occurs', async () => {
//         const mockLoginDto: LoginDto = {
//             username: "user1",
//             password: "84635bee"
//         };

//         (mockUserRepository.getUserByCredentials as jest.Mock).mockRejectedValue(new Error());

//         const result = await authService.findUserByCredentials(mockLoginDto.username,mockLoginDto.password);
//         expect(mockUserRepository.getUserByCredentials).toHaveBeenCalledWith(mockLoginDto.username,mockLoginDto.password);
//         expect(result).toBe(null);
//     });
// });