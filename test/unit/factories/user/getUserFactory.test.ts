import { Request, Response } from 'express';
import { userRepository } from '../../../../src/repositories/repositories/userRepository';
import UserService from '../../../../src/user/service/userService';
import UserController from '../../../../src/user/controller/userController';
import getUserFactory from '../../../../src/user/controller//factories/getUserFactory';

jest.mock('../../../../src/repositories/repositories/userRepository');
jest.mock('../../../../src/user/service/userService');
jest.mock('../../../../src/user/controller/userController');

describe('getUserFactory', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockGetUser: jest.Mock;

  beforeEach(() => {
    req = {
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockGetUser = jest.fn();
    (UserController as jest.Mock).mockImplementation(() => ({
      getUser: mockGetUser,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the getUser method from UserController with req and res', () => {
    getUserFactory(req as Request, res as Response);

    expect(mockGetUser).toHaveBeenCalledWith(req, res);
  });

  it('should initialize repositories and services correctly', () => {
    getUserFactory(req as Request, res as Response);

    expect(userRepository).toHaveBeenCalledTimes(1);
    expect(UserService).toHaveBeenCalledWith(expect.any(userRepository));
  });
});
