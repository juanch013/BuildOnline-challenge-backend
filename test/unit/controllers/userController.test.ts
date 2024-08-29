import UserController from '../../../src/user/controller/userController';
import IUserService from '../../../src/user/interfaces/userService';
import { Response } from 'express';
import { IRequest } from '../../../common/types/modifyesTypes/modifyedRequest';
import MyJwtPayload from '../../../common/types/modifyesTypes/jwtPayload';
import { InternalError } from '../../../common/errors/errors';
import GetUserResponse from '../../../common/types/responses/getUserResponse';


const mockUserService: IUserService = {
    getUserData: jest.fn()
};

const mockResponse = (): Partial<Response> => {
    const res: Partial<Response> = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('UserController - get user', () => {
    let userController: UserController;
    let req: Partial<IRequest>;
    let res: Partial<Response>;

    beforeEach(() => {
        userController = new UserController(mockUserService);
        req = {
            loggedUser: { id: '123',username:"user1" } as MyJwtPayload,
        };
        res = mockResponse();
    });

    it('should return user data with status code 200', async () => {
        const mockUserData:GetUserResponse = {
            code: 200,
            message:"user detail",
            data: { id: '123', username: 'John Doe' },
        };
        (mockUserService.getUserData as jest.Mock).mockResolvedValue(mockUserData);

        await userController.getUser(req as IRequest, res as Response);

        expect(mockUserService.getUserData).toHaveBeenCalledWith('123');
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUserData);
    });

    it('should return internal error when service fails', async () => {
        (mockUserService.getUserData as jest.Mock).mockRejectedValue(InternalError);

        await userController.getUser(req as IRequest, res as Response);

        expect(mockUserService.getUserData).toHaveBeenCalledWith('123');
        
        expect(res.status).toHaveBeenCalledWith(InternalError.code);
        expect(res.json).toHaveBeenCalledWith(InternalError);
    });

    it('should return status 400 when service fails', async () => {
        const mockUserData:GetUserResponse = {
            "code": 400,
            "message": "logged user does not own the note",
            "data": {}
        };

        // Configuramos el mock para que lance un error
        (mockUserService.getUserData as jest.Mock).mockResolvedValue(mockUserData);

        // Llamamos al método que estamos probando
        await userController.getUser(req as IRequest, res as Response);

        // Verificamos que el servicio fue llamado correctamente
        expect(mockUserService.getUserData).toHaveBeenCalledWith('123');
        
        // Verificamos que la respuesta fue configurada como un error interno
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(mockUserData);
    });
});
