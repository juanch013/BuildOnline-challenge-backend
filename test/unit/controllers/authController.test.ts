import { authController } from './../../../src/auth/controller/authController';
import { IAuthService } from './../../../src/auth/interfaces/authService';
import { Request, Response } from 'express';
import { IRequest } from '../../../common/types/modifyesTypes/modifyedRequest';
import { InternalError, UnautorizedError } from '../../../common/errors/errors';
import LoginResponse from '../../../common/types/responses/loginResponse';
import { LoginDto } from '../../../src/auth/dtos/loginDto';


const mockAuthService: IAuthService = {
    login: jest.fn(),
    findUserByCredentials: jest.fn(),
    createJwt: jest.fn(),
};

const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (body: any): Partial<Request> => {
    const req: Partial<Request> = { body };
    return req;
};

describe('AuthController - login', () => {
    let authControl: authController;
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        authControl = new authController(mockAuthService);
        req = mockRequest({});
        res = mockResponse();
    });

    it('should return jwt token with status code 200', async () => {
        const mockLoginData:LoginResponse = {
            code:200,
            message:"user logged in",
            data:{token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzdWFyaW8yIiwiaWQiOiI1N2Y4OWNjMC1mMGRiLTRkZjQtYjY4ZS0wMjA0MzFlM2RiMjIiLCJpYXQiOjE3MjQ4OTY1OTUsImV4cCI6MTcyNDkwMDE5NX0.LD2W4qBej3iFOkeDRm8t-Zjcc-dkX2KbPSxNwBqlbms"}
        };

        const mockLoginDto:LoginDto = {
            email:"user1",
            password:"user_1234"    
        };

        req = mockRequest(mockLoginDto);

        (mockAuthService.login as jest.Mock).mockResolvedValue(mockLoginData);

        await authControl.login(req as IRequest, res as Response);

        expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockLoginData);
    });

    it('should return internal error when service fails', async () => {
        const mockLoginDto:LoginDto = {
            email:"user1",
            password:"user_1234"    
        };

        req = mockRequest(mockLoginDto);

        (mockAuthService.login as jest.Mock).mockRejectedValue(InternalError);

        await authControl.login(req as IRequest, res as Response);

        expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

    it('should return status 401 when login fails', async () => {
        const mockLoginDto:LoginDto = {
            email:"user1",
            password:"user_1234"    
        };

        req = mockRequest(mockLoginDto);

        (mockAuthService.login as jest.Mock).mockResolvedValue(UnautorizedError);

        await authControl.login(req as Request, res as Response);

        expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginDto);
        
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(UnautorizedError);
    });
});
