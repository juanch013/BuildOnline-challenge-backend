import { IsEmail } from 'class-validator';
import { contactRepository } from './../../../src/repositories/repositories/contactRepository';
import { ContactEntity } from '../../../src/entities/contact.entity';
import { Repository } from 'typeorm';
import dataSource from '../../../src/connection/connection';
import { UserEntity } from '../../../src/entities/user.entity';
import IUserRepository from '../../../src/repositories/interfaces/userRepository';
import { userRepository } from '../../../src/repositories/repositories/userRepository';
import userData from '../../../src/auth/interfaces/userData';
import { exists } from 'fs';



describe('usersRepository - getUserById', () => {
    let usersRepo: IUserRepository;
    let mockUsersRepo: Repository<UserEntity>

    beforeEach(() => {
        mockUsersRepo = {
            findOne: jest.fn(),
        } as unknown as Repository<UserEntity>;

        jest.spyOn(dataSource, 'getRepository').mockReturnValue(mockUsersRepo);

        usersRepo = new userRepository();
    });

    it('should return User data', async () => {
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };

        const mockUserData:userData = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
        };
        
        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(mockUserEntity);

        const result = await usersRepo.getUserById(mockUserEntity.id);

        expect(result).toEqual(mockUserData);
    });

    it('should return null when an exception is handled', async () => {
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };
        
        (mockUsersRepo.findOne as jest.Mock).mockRejectedValue(new Error());

        const result = await usersRepo.getUserById(mockUserEntity.id);

        expect(result).toEqual(null);
    });

    it('should return null when user is not found', async () => {
        const mockUserEntity:UserEntity = {
            id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
            username:"user 1",
            password:"1234",
            contacts:[]
        };
        
        (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(null);

        const result = await usersRepo.getUserById(mockUserEntity.id);

        expect(result).toEqual(null);
    });

    describe('usersRepository - checkUserById', () => {
        let usersRepo: IUserRepository;
        let mockUsersRepo: Repository<UserEntity>
    
        beforeEach(() => {
            mockUsersRepo = {
                findOne: jest.fn(),
                exists:jest.fn(),
            } as unknown as Repository<UserEntity>;
    
            jest.spyOn(dataSource, 'getRepository').mockReturnValue(mockUsersRepo);
    
            usersRepo = new userRepository();
        });
    
        it('should return true if user exist', async () => {
            const mockUserId="07375735-bd6c-46ee-adcd-2a73f76826ef";
            
            (mockUsersRepo.exists as jest.Mock).mockResolvedValue(true);
    
            const result = await usersRepo.chekUserById(mockUserId);
    
            expect(result).toEqual(true);
        });
    
        it('should return null when an exception is handled', async () => {
            const mockUserId="07375735-bd6c-46ee-adcd-2a73f76826ef";

            (mockUsersRepo.exists as jest.Mock).mockRejectedValue(new Error());
    
            const result = await usersRepo.chekUserById(mockUserId);
    
            expect(result).toEqual(null);
        }); 
    });

    describe('usersRepository - getUserByCredentials', () => {
        let usersRepo: IUserRepository;
        let mockUsersRepo: Repository<UserEntity>
    
        beforeEach(() => {
            mockUsersRepo = {
                findOne: jest.fn(),
            } as unknown as Repository<UserEntity>;
    
            jest.spyOn(dataSource, 'getRepository').mockReturnValue(mockUsersRepo);
    
            usersRepo = new userRepository();
        });
    
        it('should return User data', async () => {
            const mockUserEntity:UserEntity = {
                id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
                username:"user 1",
                password:"1234",
                contacts:[]
            };
    
            const mockUserData:userData = {
                id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
                username:"user 1",
            };
            
            (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(mockUserEntity);
    
            const result = await usersRepo.getUserByCredentials(mockUserEntity.username,mockUserEntity.password);
    
            expect(result).toEqual(mockUserData);
        });
    
        it('should return null when an exception is handled', async () => {
            const mockUserEntity:UserEntity = {
                id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
                username:"user 1",
                password:"1234",
                contacts:[]
            };
            
            (mockUsersRepo.findOne as jest.Mock).mockRejectedValue(new Error());
    
            const result = await usersRepo.getUserByCredentials(mockUserEntity.username,mockUserEntity.password);
    
            expect(result).toEqual(null);
        });
    
        it('should return null when user is not found', async () => {
            const mockUserEntity:UserEntity = {
                id:"07375735-bd6c-46ee-adcd-2a73f76826ef",
                username:"user 1",
                password:"1234",
                contacts:[]
            };
            
            (mockUsersRepo.findOne as jest.Mock).mockResolvedValue(null);
    
            const result = await usersRepo.getUserByCredentials(mockUserEntity.username,mockUserEntity.password);
    
            expect(result).toEqual(null);
        });
    });
});