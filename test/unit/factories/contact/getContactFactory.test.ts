import { Request, Response } from 'express';
import { contactRepository } from '../../../../src/repositories/repositories/contactRepository';
import { userRepository } from '../../../../src/repositories/repositories/userRepository';
import { contactService } from '../../../../src/contact/services/contactService';
import contactController from '../../../../src/contact/controller/contactController';
import getContactFactory from '../../../../src/contact/controller/factories/getContactFactory';

jest.mock('../../../../src/repositories/repositories/contactRepository');
jest.mock('../../../../src/repositories/repositories/userRepository');
jest.mock('../../../../src/contact/services/contactService');
jest.mock('../../../../src/contact/controller/contactController');

describe('getContactFactory', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockGetContact: jest.Mock;

  beforeEach(() => {
    req = {
      params: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockGetContact = jest.fn();
    (contactController as jest.Mock).mockImplementation(() => ({
      getContact: mockGetContact,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should call getContact from controller with req and res', () => {
    getContactFactory(req as Request, res as Response);

    expect(mockGetContact).toHaveBeenCalledWith(req, res);
  });

  it('Should initialize controllers,respos and services correctly', () => {
    getContactFactory(req as Request, res as Response);

    expect(contactRepository).toHaveBeenCalledTimes(1);
    expect(userRepository).toHaveBeenCalledTimes(1);
    expect(contactService).toHaveBeenCalledWith(
      expect.any(contactRepository),
      expect.any(userRepository)
    );
  });
});
