import { userRepository } from './../../../src/repositories/repositories/userRepository';
import AuthService from "../../../src/auth/service/authService";
import IUserRepository from "../../../src/repositories/interfaces/userRepository";
import LoginResponse from "../../../common/types/responses/loginResponse";
import { LoginDto } from "../../../src/auth/dtos/loginDto";
import userData from "../../../src/auth/interfaces/userData";
import * as jwt from 'jsonwebtoken';
import exp from "constants";
import { InternalError } from "../../../common/errors/errors";

jest.mock('jsonwebtoken'); // Mockea la librería jsonwebtoken

const mockUserRepository: IUserRepository = {
    getUserByCredentials: jest.fn(),
    chekUserById: jest.fn(),
    getUserById: jest.fn(),
};

describe('AuthService - login', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService(mockUserRepository);
        jest.clearAllMocks();
    });

    it('should return loginResponse with token in it', async () => {
        const mockToken = "example-token";
        const expectedResponse: LoginResponse = {
            code: 200,
            message: "user logged in",
            data: { token: mockToken }
        };

        const mockLoginDto: LoginDto = {
            username: "user1",
            password: "user_1234"
        };

        const mockGetUserByCredentialsData: userData = {
            username: "user1",
            id: "84635bee-03c3-42a2-807e-4c7bdc8aba62"
        };

        (mockUserRepository.getUserByCredentials as jest.Mock).mockResolvedValue(mockGetUserByCredentialsData);

        (jwt.sign as jest.Mock).mockReturnValue(mockToken);
        const result = await authService.login(mockLoginDto);

        expect(mockUserRepository.getUserByCredentials).toHaveBeenCalledWith(mockLoginDto.username, mockLoginDto.password);
        expect(jwt.sign).toHaveBeenCalledWith(mockGetUserByCredentialsData, expect.any(String), { expiresIn: '1h' });
        
        expect(result).toEqual(expectedResponse);
    });

    it('should return unauthorized when credentials are incorrect', async () => {

        const mockExpectedResponse: LoginResponse = {
            code:401,
            message:"Unautorized",
            data: {}
        };

        const mockLoginDto: LoginDto = {
            username: "user1",
            password: "user_1234"
        };

        (mockUserRepository.getUserByCredentials as jest.Mock).mockResolvedValue(null);

        const result = await authService.login(mockLoginDto);

        expect(mockUserRepository.getUserByCredentials).toHaveBeenCalledWith(mockLoginDto.username, mockLoginDto.password);

        expect(result).toEqual(mockExpectedResponse);
    });

    it('should return internal error when exeption is handled', async () => {
        const mockLoginDto: LoginDto = {
            username: "user1",
            password: "user_1234"
        };

        const mockGetUserByCredentialsData: userData = {
            username: "user1",
            id: "84635bee-03c3-42a2-807e-4c7bdc8aba62"
        };

        (mockUserRepository.getUserByCredentials as jest.Mock).mockResolvedValue(mockGetUserByCredentialsData);
        jest.spyOn(authService, 'createJwt').mockImplementation(() => {
            throw new Error("JWT creation failed");
        });
        const result = await authService.login(mockLoginDto);
        expect(mockUserRepository.getUserByCredentials).toHaveBeenCalledWith(mockLoginDto.username, mockLoginDto.password);
        expect(result).toEqual(InternalError);
    });
});

describe('AuthService - createJwt', () => {
    let authService: AuthService;

    beforeEach(() => {
        authService = new AuthService(mockUserRepository);
        jest.clearAllMocks();
    });

    it('should return token', async () => {
        const mockUserData: userData = {
            username: "user1",
            id: "84635bee-03c3-42a2-807e-4c7bdc8aba62"
        };
        jest.spyOn(jwt, 'sign').mockImplementation(() => {
            throw new Error("JWT creation failed");
        });

        const result = authService.createJwt(mockUserData);
        expect(jwt.sign).toHaveBeenCalledWith(mockUserData, expect.any(String), { expiresIn: '1h' });
        expect(result).toBeNull();
    });

    it('should return unauthorized when credentials are incorrect', async () => {
        const mockUserData: userData = {
            username: "user1",
            id: "84635bee-03c3-42a2-807e-4c7bdc8aba62"
        };

        const mockToken = "mocked-token";

        jest.spyOn(jwt, 'sign').mockImplementation(() => {
            return mockToken
        });

        const result = authService.createJwt(mockUserData);
        expect(jwt.sign).toHaveBeenCalledWith(mockUserData, expect.any(String), { expiresIn: '1h' });
        expect(result).toEqual(mockToken);
    });
});

describe('AuthService - findUserByCredentials', () => {
    let authService: AuthService; 

    beforeEach(() => {
        authService = new AuthService(mockUserRepository);
        jest.clearAllMocks();
    });

    it('should return userData', async () => {
        const mockLoginDto: LoginDto = {
            username: "user1",
            password: "84635bee"
        };

        const mockUserData: userData = {
            username: "user1",
            id: "84635bee-03c3-42a2-807e-4c7bdc8aba62"
        };
    
        (mockUserRepository.getUserByCredentials as jest.Mock).mockResolvedValue(mockUserData);
        

        const result = await authService.findUserByCredentials(mockLoginDto.username,mockLoginDto.password);
        expect(mockUserRepository.getUserByCredentials).toHaveBeenCalledWith(mockLoginDto.username,mockLoginDto.password);
        expect(result).toBe(mockUserData);
    });

    it('should return null when credentials are incorrect', async () => {
        const mockLoginDto: LoginDto = {
            username: "user1",
            password: "84635bee"
        };

        (mockUserRepository.getUserByCredentials as jest.Mock).mockResolvedValue(null);

        const result = await authService.findUserByCredentials(mockLoginDto.username,mockLoginDto.password);
        expect(mockUserRepository.getUserByCredentials).toHaveBeenCalledWith(mockLoginDto.username,mockLoginDto.password);
        expect(result).toBe(null);
    });

    it('should return null when an errors occurs', async () => {
        const mockLoginDto: LoginDto = {
            username: "user1",
            password: "84635bee"
        };

        (mockUserRepository.getUserByCredentials as jest.Mock).mockRejectedValue(new Error());

        const result = await authService.findUserByCredentials(mockLoginDto.username,mockLoginDto.password);
        expect(mockUserRepository.getUserByCredentials).toHaveBeenCalledWith(mockLoginDto.username,mockLoginDto.password);
        expect(result).toBe(null);
    });
});