import { Request, Response } from 'express';
import { authController } from '../../../../src/auth/controller/authController';
import { userRepository } from '../../../../src/repositories/repositories/userRepository';
import AuthService from '../../../../src/auth/service/authService';
import authLoginFactory from '../../../../src/auth/controller/factories/authLoginFactory';

jest.mock('../../../../src/repositories/repositories/userRepository');
jest.mock('../../../../src/auth/service/authService');
jest.mock('../../../../src/auth/controller/authController');

describe('authLoginFactory', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockLogin: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockLogin = jest.fn();
    (authController as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the login method from authController with req and res', () => {
    authLoginFactory(req as Request, res as Response);

    expect(mockLogin).toHaveBeenCalledWith(req, res);
  });

  it('should initialize repositories and services correctly', () => {
    authLoginFactory(req as Request, res as Response);

    expect(userRepository).toHaveBeenCalledTimes(1);
    expect(AuthService).toHaveBeenCalledWith(expect.any(userRepository));
  });
});
