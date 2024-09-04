import { contactRepository } from './../../../src/repositories/repositories/contactRepository';
import IContactRepository from "../../../src/repositories/interfaces/contactRepository";
import { ContactData } from '../../../src/contact/interfaces/contactData';
import { ContactEntity } from '../../../src/entities/contact.entity';
import { ObjectLiteral, Repository } from 'typeorm';
import dataSource from '../../../src/connection/connection';
import { UserEntity } from '../../../src/entities/user.entity';
import UserService from '../../../src/user/service/userService';
import { UpdateResult } from 'typeorm/browser';



describe('contactRepository - getContactById', () => {
    let contactRepo: IContactRepository;
    let mockContactsRepo: Repository<ContactEntity>

    beforeEach(() => {
        mockContactsRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<ContactEntity>;

        jest.spyOn(dataSource, 'getRepository').mockReturnValue(mockContactsRepo);

        contactRepo = new contactRepository();
    });

    it('should return contact data', async () => {
        const mockContactData:ContactData = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
        };
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
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
        
        (mockContactsRepo.findOne as jest.Mock).mockResolvedValue(mockContactEntity);

        const result = await contactRepo.getContactById(mockContactEntity.id);

        expect(result).toEqual(mockContactData);
    });

    it('should return null when error is handled', async () => {
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
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
        
        (mockContactsRepo.findOne as jest.Mock).mockRejectedValue(new Error());

        const result = await contactRepo.getContactById(mockContactEntity.id);

        expect(result).toEqual(null);
    });

    it('should return null when userId does not exist', async () => {
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
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
        
        (mockContactsRepo.findOne as jest.Mock).mockResolvedValue(null);

        const result = await contactRepo.getContactById(mockContactEntity.id);

        expect(result).toEqual(null);
    });
});

describe('contactRepository - checkEmailExist', () => {
    let contactRepo: IContactRepository;
    let mockContactsRepo: Repository<ContactEntity>
    let mockUsersRepo: Repository<UserEntity>

    beforeEach(() => {
        mockContactsRepo = {
            findOne: jest.fn(),
            exists: jest.fn(),
        } as unknown as Repository<ContactEntity>;

        mockUsersRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<UserEntity>;

        jest.spyOn(dataSource, 'getRepository')
            .mockImplementation((entity) => {
                if (entity === ContactEntity) {
                    return mockContactsRepo as Repository<ObjectLiteral>;
                } else if (entity === UserEntity) {
                    return mockUsersRepo as Repository<ObjectLiteral>;
                }
                throw new Error(`Unexpected entity: ${entity}`);
            });

        contactRepo = new contactRepository();
    });

    it('should return true when exist a contact with the email for the logged user', async () => {
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        const contactId = "f84cb343-c466-4089-8d61-1c98bbd98dd2";
        const email = "contact1@gmail.com";


        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(mockUserEntity);
        (mockContactsRepo.exists as jest.Mock).mockResolvedValue(true);

        const result = await contactRepo.checkEmailExist(contactId,email);

        expect(result).toEqual(true);
    });

    it('should return null when the user do not exist', async () => {

        const contactId = "f84cb343-c466-4089-8d61-1c98bbd98dd2";
        const email = "contact1@gmail.com";


        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(null);

        const result = await contactRepo.checkEmailExist(contactId,email);

        expect(result).toEqual(null);
    });

    it('should return null when an error occurs', async () => {

        const contactId = "f84cb343-c466-4089-8d61-1c98bbd98dd2";
        const email = "contact1@gmail.com";


        (mockUsersRepo.findOne as jest.Mock).mockRejectedValue(new Error());

        const result = await contactRepo.checkEmailExist(contactId,email);

        expect(result).toEqual(null);
    });

});

describe('contactRepository - checkContactIdExistForUser', () => {
    let contactRepo: IContactRepository;
    let mockContactsRepo: Repository<ContactEntity>
    let mockUsersRepo: Repository<UserEntity>

    beforeEach(() => {
        mockContactsRepo = {
            findOne: jest.fn(),
            exists: jest.fn(),
        } as unknown as Repository<ContactEntity>;

        mockUsersRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<UserEntity>;

        jest.spyOn(dataSource, 'getRepository')
            .mockImplementation((entity) => {
                if (entity === ContactEntity) {
                    return mockContactsRepo as Repository<ObjectLiteral>;
                } else if (entity === UserEntity) {
                    return mockUsersRepo as Repository<ObjectLiteral>;
                }
                throw new Error(`Unexpected entity: ${entity}`);
            });

        contactRepo = new contactRepository();
    });

    it('should return true when the contact exist for logged user', async () => {
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        const contactId = "f84cb343-c466-4089-8d61-1c98bbd98dd2";
        const email = "contact1@gmail.com";


        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(mockUserEntity);
        (mockContactsRepo.exists as jest.Mock).mockResolvedValue(true);

        const result = await contactRepo.checkContactIdExistForUser(contactId,email);

        expect(result).toEqual(true);
    });

    it('should return null when the user do not exist', async () => {

        const contactId = "f84cb343-c466-4089-8d61-1c98bbd98dd2";
        const email = "contact1@gmail.com";


        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(null);

        const result = await contactRepo.checkContactIdExistForUser(contactId,email);

        expect(result).toEqual(null);
    });

    it('should return null when an error occurs', async () => {

        const contactId = "f84cb343-c466-4089-8d61-1c98bbd98dd2";
        const email = "contact1@gmail.com";


        (mockUsersRepo.findOne as jest.Mock).mockRejectedValue(new Error());

        const result = await contactRepo.checkContactIdExistForUser(contactId,email);

        expect(result).toEqual(null);
    });

});

describe('contactRepository - UpdateContact', () => {
    let contactRepo: IContactRepository;
    let mockContactsRepo: Repository<ContactEntity>
    let mockUsersRepo: Repository<UserEntity>

    beforeEach(() => {
        mockContactsRepo = {
            findOne: jest.fn(),
            exists: jest.fn(),
            update:jest.fn(),
        } as unknown as Repository<ContactEntity>;

        mockUsersRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<UserEntity>;

        jest.spyOn(dataSource, 'getRepository')
            .mockImplementation((entity) => {
                if (entity === ContactEntity) {
                    return mockContactsRepo as Repository<ObjectLiteral>;
                } else if (entity === UserEntity) {
                    return mockUsersRepo as Repository<ObjectLiteral>;
                }
                throw new Error(`Unexpected entity: ${entity}`);
            });

        contactRepo = new contactRepository();
    });

    it('should return contact data after updating it', async () => {
        const mockContactData:ContactData = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
        };
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        const mockUpdateResult:UpdateResult = {
            affected:1,
            raw:"",
            generatedMaps:[]

        };

        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(mockUserEntity);

        (mockContactsRepo.update as jest.Mock).mockResolvedValue(mockUpdateResult);

        const result = await contactRepo.updateContactData(mockUserEntity.id,mockContactData.id,mockContactData.name,mockContactData.email,mockContactData.phoneNumber);

        expect(result).toEqual(mockContactData);
    });

    it('should return null when userid does not exist', async () => {
        const mockContactData:ContactData = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
        };
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        const mockUpdateResult:UpdateResult = {
            affected:0,
            raw:"",
            generatedMaps:[]
        };

        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(mockUserEntity);
        (mockContactsRepo.update as jest.Mock).mockResolvedValue(mockUpdateResult);

        const result = await contactRepo.updateContactData(mockUserEntity.id,mockContactData.id,mockContactData.name,mockContactData.email,mockContactData.phoneNumber);

        expect(result).toEqual(null);
    });

    it('should return null when affectedRows is 0 in updateResult', async () => {
        const mockContactData:ContactData = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
        };
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(null);

        const result = await contactRepo.updateContactData(mockUserEntity.id,mockContactData.id,mockContactData.name,mockContactData.email,mockContactData.phoneNumber);

        expect(result).toEqual(null);
    });

    it('should return null when an exeption is handled', async () => {
        const mockContactData:ContactData = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
        };
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        (mockUsersRepo.findOne as jest.Mock).mockRejectedValue(new Error());

        const result = await contactRepo.updateContactData(mockUserEntity.id,mockContactData.id,mockContactData.name,mockContactData.email,mockContactData.phoneNumber);

        expect(result).toEqual(null);
    });
});

describe('contactRepository - CreateContact', () => {
    let contactRepo: IContactRepository;
    let mockContactsRepo: Repository<ContactEntity>
    let mockUsersRepo: Repository<UserEntity>

    beforeEach(() => {
        mockContactsRepo = {
            findOne: jest.fn(),
            exists: jest.fn(),
            update:jest.fn(),
            save: jest.fn(),
        } as unknown as Repository<ContactEntity>;

        mockUsersRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<UserEntity>;

        jest.spyOn(dataSource, 'getRepository')
            .mockImplementation((entity) => {
                if (entity === ContactEntity) {
                    return mockContactsRepo as Repository<ObjectLiteral>;
                } else if (entity === UserEntity) {
                    return mockUsersRepo as Repository<ObjectLiteral>;
                }
                throw new Error(`Unexpected entity: ${entity}`);
            });

        contactRepo = new contactRepository();
    });

    it('should return contact data after creating it', async () => {
        const mockContactData:ContactData = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
        };

        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
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

        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(mockUserEntity);

        (mockContactsRepo.save as jest.Mock).mockResolvedValue(mockContactEntity);

        const result = await contactRepo.createContact(mockUserEntity.id,mockContactData.name,mockContactData.email,mockContactData.phoneNumber);

        expect(result).toEqual(mockContactData);
    });

    it('should return null when user does not exist', async () => {
        const mockContactData:ContactData = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
        };
        
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(null);

        const result = await contactRepo.createContact(mockUserEntity.id,mockContactData.name,mockContactData.email,mockContactData.phoneNumber);

        expect(result).toEqual(null);
    });

    it('should return null when error occurs creating the contact', async () => {
        const mockContactData:ContactData = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
        };
        
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(mockUserEntity);

        (mockContactsRepo.save as jest.Mock).mockResolvedValue(null);

        const result = await contactRepo.createContact(mockUserEntity.id,mockContactData.name,mockContactData.email,mockContactData.phoneNumber);

        expect(result).toEqual(null);
    });

    it('should return null when exception is handled', async () => {
        const mockContactData:ContactData = {
            name:"contact 1",
            email:"contact1@gmail.com",
            phoneNumber:"099111222",
            id:"f84cb343-c466-4089-8d61-1c98bbd98dd2"
        };
        
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        (mockUsersRepo.findOne as jest.Mock).mockRejectedValue(new Error());

        const result = await contactRepo.createContact(mockUserEntity.id,mockContactData.name,mockContactData.email,mockContactData.phoneNumber);

        expect(result).toEqual(null);
    });
});

describe('contactRepository - listContactsPaginated', () => {
    let contactRepo: IContactRepository;
    let mockContactsRepo: Repository<ContactEntity>
    let mockUsersRepo: Repository<UserEntity>

    beforeEach(() => {
        mockContactsRepo = {
            findOne: jest.fn(),
            exists: jest.fn(),
            update:jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
        } as unknown as Repository<ContactEntity>;

        mockUsersRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<UserEntity>;

        jest.spyOn(dataSource, 'getRepository')
            .mockImplementation((entity) => {
                if (entity === ContactEntity) {
                    return mockContactsRepo as Repository<ObjectLiteral>;
                } else if (entity === UserEntity) {
                    return mockUsersRepo as Repository<ObjectLiteral>;
                }
                throw new Error(`Unexpected entity: ${entity}`);
            });

        contactRepo = new contactRepository();
    });

    it('should return contacts data for logged user', async () => {
        const mockContactData:ContactData[] = [
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
                id:"f84cb343-c466-4089-8d61-1c98bbd22222"
            }
        ];

        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        const page = 1;
        const quantity = 2;

        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(mockUserEntity);

        (mockContactsRepo.find as jest.Mock).mockResolvedValue(mockContactData);

        const result = await contactRepo.listContactsPaginated(mockUserEntity.id,page,quantity);

        expect(result).toEqual(mockContactData);
    });

    it('should return null when userid does not exist', async () => {

        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        const page = 1;
        const quantity = 2;

        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(null);


        const result = await contactRepo.listContactsPaginated(mockUserEntity.id,page,quantity);

        expect(result).toEqual(null);
    });

    it('should return null when error is handled', async () => {

        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        const page = 1;
        const quantity = 2;

        (mockUsersRepo.findOne as jest.Mock).mockRejectedValue(new Error());


        const result = await contactRepo.listContactsPaginated(mockUserEntity.id,page,quantity);

        expect(result).toEqual(null);
    });
});