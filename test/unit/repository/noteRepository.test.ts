import { noteRepository } from './../../../src/repositories/repositories/noteRepository';
import { ContactData } from '../../../src/contact/interfaces/contactData';
import { ContactEntity } from '../../../src/entities/contact.entity';
import dataSource from '../../../src/connection/connection';
import { ObjectLiteral, Repository } from 'typeorm';
import { NoteEntity } from '../../../src/entities/note.entity';
import { noteData } from '../../../src/notes/interfaces/noteData';
import INoteRepository from '../../../src/repositories/interfaces/noteRepository';
import { UserEntity } from '../../../src/entities/user.entity';

describe('NoteRepository - createNote', () => {
    let noteRepo: INoteRepository;

    let mockContactsRepo: Repository<ContactEntity>
    let mockNotesRepository: Repository<NoteEntity>
    let mockUsersRepository: Repository<UserEntity>

    beforeEach(() => {
        mockContactsRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<ContactEntity>;

        mockNotesRepository = {
            save: jest.fn(),
        } as unknown as Repository<NoteEntity>;

        mockUsersRepository = {
            save: jest.fn(),
        } as unknown as Repository<UserEntity>;
        
        jest.spyOn(dataSource, 'getRepository')
            .mockImplementation((entity) => {
                if (entity === ContactEntity) {
                    return mockContactsRepo as Repository<ObjectLiteral>;
                } else if (entity === NoteEntity) {
                    return mockNotesRepository as Repository<ObjectLiteral>;
                } else if (entity === UserEntity) {
                    return mockUsersRepository as Repository<ObjectLiteral>;
                }
                throw new Error(`Unexpected entity: ${entity}`);
            });

        noteRepo = new noteRepository();
    });

    it('should return note data after creating it', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNoteData:noteData = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            note:"note 1",
            createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
        };

        const mockContactEntity:ContactEntity = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2",
            user:mockUserEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            notes:[]
        };

        const mockNoteEntity:NoteEntity = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            contact:mockContactEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            note:"note 1"
        };
        
        (mockContactsRepo.findOne as jest.Mock).mockResolvedValue(mockContactEntity);
        (mockNotesRepository.save as jest.Mock).mockResolvedValue(mockNoteEntity);

        const result = await noteRepo.createNote(mockContactEntity.id,mockNoteData.note);

        expect(result).toEqual(mockNoteData);
    });

    it('should return null when the contact is not found', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNoteData:noteData = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            note:"note 1",
            createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
        };

        const mockContactEntity:ContactEntity = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2",
            user:mockUserEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            notes:[]
        };
        
        (mockContactsRepo.findOne as jest.Mock).mockResolvedValue(null);

        const result = await noteRepo.createNote(mockContactEntity.id,mockNoteData.note);

        expect(result).toEqual(null);
    });

    it('should return null when an exception is handled', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNoteData:noteData = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            note:"note 1",
            createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
        };

        const mockContactEntity:ContactEntity = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2",
            user:mockUserEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            notes:[]
        };
        
        (mockContactsRepo.findOne as jest.Mock).mockRejectedValue(new Error());

        const result = await noteRepo.createNote(mockContactEntity.id,mockNoteData.note);

        expect(result).toEqual(null);
    });
});

describe('NoteRepository - checkNoteOwner', () => {
    let noteRepo: INoteRepository;

    let mockContactsRepo: Repository<ContactEntity>
    let mockNotesRepository: Repository<NoteEntity>
    let mockUsersRepository: Repository<UserEntity>

    beforeEach(() => {
        mockContactsRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<ContactEntity>;

        mockNotesRepository = {
            save: jest.fn(),
            exists: jest.fn(),
        } as unknown as Repository<NoteEntity>;

        mockUsersRepository = {
            save: jest.fn(),
        } as unknown as Repository<UserEntity>;
        
        jest.spyOn(dataSource, 'getRepository')
            .mockImplementation((entity) => {
                if (entity === ContactEntity) {
                    return mockContactsRepo as Repository<ObjectLiteral>;
                } else if (entity === NoteEntity) {
                    return mockNotesRepository as Repository<ObjectLiteral>;
                } else if (entity === UserEntity) {
                    return mockUsersRepository as Repository<ObjectLiteral>;
                }
                throw new Error(`Unexpected entity: ${entity}`);
            });

        noteRepo = new noteRepository();
    });

    it('should return true when note is owned by the logged user', async () => {     

        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNoteData:noteData = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            note:"note 1",
            createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
        };
        
        (mockNotesRepository.exists as jest.Mock).mockResolvedValue(true);

        const result = await noteRepo.checkNoteOwner(mockUserEntity.id,mockNoteData.id);

        expect(result).toEqual(true);
    });

    it('should return false when the logged user does not own the note', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNoteData:noteData = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            note:"note 1",
            createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
        };
        
        (mockNotesRepository.exists as jest.Mock).mockResolvedValue(true);

        const result = await noteRepo.checkNoteOwner(mockUserEntity.id,mockNoteData.id);

        expect(result).toEqual(true);
    });

    it('should return null when an exception is handled', async () => {     

        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNoteData:noteData = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            note:"note 1",
            createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
        };
        
        (mockNotesRepository.exists as jest.Mock).mockRejectedValue(new Error());

        const result = await noteRepo.checkNoteOwner(mockUserEntity.id,mockNoteData.id);

        expect(result).toEqual(null);
    });
});

describe('NoteRepository - listNotesPaginated', () => {
    let noteRepo: INoteRepository;

    let mockContactsRepo: Repository<ContactEntity>
    let mockNotesRepository: Repository<NoteEntity>
    let mockUsersRepository: Repository<UserEntity>

    beforeEach(() => {
        mockContactsRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<ContactEntity>;

        mockNotesRepository = {
            save: jest.fn(),
            find: jest.fn()
        } as unknown as Repository<NoteEntity>;

        mockUsersRepository = {
            save: jest.fn(),
            findOne: jest.fn(),
        } as unknown as Repository<UserEntity>;
        
        jest.spyOn(dataSource, 'getRepository')
            .mockImplementation((entity) => {
                if (entity === ContactEntity) {
                    return mockContactsRepo as Repository<ObjectLiteral>;
                } else if (entity === NoteEntity) {
                    return mockNotesRepository as Repository<ObjectLiteral>;
                } else if (entity === UserEntity) {
                    return mockUsersRepository as Repository<ObjectLiteral>;
                }
                throw new Error(`Unexpected entity: ${entity}`);
            });

        noteRepo = new noteRepository();
    });

    it('should return list of notes paginated', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNotesData:noteData[] = [
            {
                id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
                note:"note 1",
                createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
            },
            {
                id:"05c43bea-681f-42c3-80fa-8d0072e5a666",
                note:"note 2",
                createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
            }
        ];

        const mockContactEntity:ContactEntity = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2",
            user:mockUserEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            notes:[]
        };

        const mockNotesEntity:NoteEntity[] = [
            {
                id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
                contact:mockContactEntity,
                createdAt:new Date("2024-08-25 01:54:55.028440"),
                note:"note 1"
            },
            {
                id:"05c43bea-681f-42c3-80fa-8d0072e5a666",
                contact:mockContactEntity,
                createdAt:new Date("2024-08-25 01:54:55.028440"),
                note:"note 2"
            }
        ];

        const page = 1;
        const quantity = 2;
        
        (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(mockContactEntity);
        (mockNotesRepository.find as jest.Mock).mockResolvedValue(mockNotesEntity);

        const result = await noteRepo.listNotesPaginated(mockContactEntity.id,page,quantity);

        expect(result).toEqual(mockNotesData);
    });

    it('should return null when user does not exist', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };

        const mockContactEntity:ContactEntity = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2",
            user:mockUserEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            notes:[]
        };

        const page = 1;
        const quantity = 2;
        
        (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(null);

        const result = await noteRepo.listNotesPaginated(mockContactEntity.id,page,quantity);

        expect(result).toEqual(null);
    });

    it('should return null when exception is handled', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };

        const mockContactEntity:ContactEntity = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2",
            user:mockUserEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            notes:[]
        };

        const page = 1;
        const quantity = 2;
        
        (mockUsersRepository.findOne as jest.Mock).mockRejectedValue(new Error());

        const result = await noteRepo.listNotesPaginated(mockContactEntity.id,page,quantity);

        expect(result).toEqual(null);
    });
});

describe('NoteRepository - getNoteById', () => {
    let noteRepo: INoteRepository;

    let mockContactsRepo: Repository<ContactEntity>
    let mockNotesRepository: Repository<NoteEntity>
    let mockUsersRepository: Repository<UserEntity>

    beforeEach(() => {
        mockContactsRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<ContactEntity>;

        mockNotesRepository = {
            save: jest.fn(),
            findOne: jest.fn(),
        } as unknown as Repository<NoteEntity>;

        mockUsersRepository = {
            save: jest.fn(),
            findOne: jest.fn(),
        } as unknown as Repository<UserEntity>;
        
        jest.spyOn(dataSource, 'getRepository')
            .mockImplementation((entity) => {
                if (entity === ContactEntity) {
                    return mockContactsRepo as Repository<ObjectLiteral>;
                } else if (entity === NoteEntity) {
                    return mockNotesRepository as Repository<ObjectLiteral>;
                } else if (entity === UserEntity) {
                    return mockUsersRepository as Repository<ObjectLiteral>;
                }
                throw new Error(`Unexpected entity: ${entity}`);
            });

        noteRepo = new noteRepository();
    });

    it('should return note data', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNoteData:noteData = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            note:"note 1",
            createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
        };

        const mockContactEntity:ContactEntity = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2",
            user:mockUserEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            notes:[]
        };

        const mockNoteEntity:NoteEntity = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            contact:mockContactEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            note:"note 1"
        };
        
        (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(mockContactEntity);
        (mockNotesRepository.findOne as jest.Mock).mockResolvedValue(mockNoteEntity);

        const result = await noteRepo.getNotebById(mockContactEntity.id,mockNoteData.id);

        expect(result).toEqual(mockNoteData);
    });

    it('should return null when user do not exist', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNoteData:noteData = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            note:"note 1",
            createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
        };

        const mockContactEntity:ContactEntity = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2",
            user:mockUserEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            notes:[]
        };

        (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(null);

        const result = await noteRepo.getNotebById(mockContactEntity.id,mockNoteData.id);

        expect(result).toEqual(null);
    });

    it('should return null when exception is handled', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNoteData:noteData = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            note:"note 1",
            createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
        };

        const mockContactEntity:ContactEntity = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2",
            user:mockUserEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            notes:[]
        };

        (mockUsersRepository.findOne as jest.Mock).mockRejectedValue(new Error());

        const result = await noteRepo.getNotebById(mockContactEntity.id,mockNoteData.id);

        expect(result).toEqual(null);
    });

    it('should return null when error occurs getting the note', async () => {     
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            email:"user 1",
            password:"1234",
            contacts:[]
        };
        
        const mockNoteData:noteData = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            note:"note 1",
            createdAt:new Date("2024-08-25 01:54:55.028440").toISOString()
        };

        const mockContactEntity:ContactEntity = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2",
            user:mockUserEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            notes:[]
        };

        const mockNoteEntity:NoteEntity = {
            id:"05c43bea-681f-42c3-80fa-8d0072e5a3e5",
            contact:mockContactEntity,
            createdAt:new Date("2024-08-25 01:54:55.028440"),
            note:"note 1"
        };
        
        (mockUsersRepository.findOne as jest.Mock).mockResolvedValue(mockContactEntity);
        (mockNotesRepository.findOne as jest.Mock).mockResolvedValue(null);

        const result = await noteRepo.getNotebById(mockContactEntity.id,mockNoteData.id);

        expect(result).toEqual(null);
    });
});