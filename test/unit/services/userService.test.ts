import IUserRepository from "../../../src/repositories/interfaces/userRepository";
import userData from "../../../src/auth/interfaces/userData";
import { InternalError } from "../../../common/errors/errors";
import IUserService from "../../../src/user/interfaces/userService"
import userService from "../../../src/user/service/userService"
import GetUserResponse from '../../../common/types/responses/getUserResponse';

const mockUserRepository: IUserRepository = {
    getUserByCredentials: jest.fn(),
    chekUserById: jest.fn(),
    getUserById: jest.fn(),
};

describe('userService - getUser', () => {
    let userServ: IUserService;

    beforeEach(() => {
        userServ = new userService(mockUserRepository);
        jest.clearAllMocks();
    });

    it('should return user data', async () => {

        const expectedResponse: GetUserResponse = {
            code:200,
            message:"user detail",
            data:{
                username: "user1",
                id: "84635bee-03c3-42a2-807e-4c7bdc8aba62"
            }
        };

        const mockUserData:userData = {
             username: "user1",
            id: "84635bee-03c3-42a2-807e-4c7bdc8aba62"
        }

        const mockUserId = "84635bee-03c3-42a2-807e-4c7bdc8aba62";

        (mockUserRepository.getUserById as jest.Mock).mockResolvedValue(mockUserData);

        const result = await userServ.getUserData(mockUserId);

        expect(mockUserRepository.getUserById).toHaveBeenCalledWith(mockUserId);        
        expect(result).toEqual(expectedResponse);
    });


    it('should return 400 when user does not exist', async () => {
        const expectedResponse: GetUserResponse = {
            code:400,
            message:"user does not exist",
            data:{}
        };

        const mockUserId = "84635bee-03c3-42a2-807e-4c7bdc8aba62";

        (mockUserRepository.getUserById as jest.Mock).mockResolvedValue(null);

        const result = await userServ.getUserData(mockUserId);

        expect(mockUserRepository.getUserById).toHaveBeenCalledWith(mockUserId);        
        expect(result).toEqual(expectedResponse);
    });

    it('should return null when exeption is handled', async () => {
        const mockUserId = "84635bee-03c3-42a2-807e-4c7bdc8aba62";

        (mockUserRepository.getUserById as jest.Mock).mockRejectedValue(new Error);

        const result = await userServ.getUserData(mockUserId);

        expect(mockUserRepository.getUserById).toHaveBeenCalledWith(mockUserId);        
        expect(result).toEqual(InternalError);
    });
});
