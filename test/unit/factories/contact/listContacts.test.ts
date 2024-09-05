import { Request, Response } from 'express';
import { contactRepository } from '../../../../src/repositories/repositories/contactRepository';
import { userRepository } from '../../../../src/repositories/repositories/userRepository';
import { contactService } from '../../../../src/contact/services/contactService';
import contactController from '../../../../src/contact/controller/contactController';
import listContactFactory from '../../../../src/contact/controller/factories/listContactsFactory';

jest.mock('../../../../src/repositories/repositories/contactRepository');
jest.mock('../../../../src/repositories/repositories/userRepository');
jest.mock('../../../../src/contact/services/contactService');
jest.mock('../../../../src/contact/controller/contactController');

describe('listContactFactory', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockListContacts: jest.Mock;

  beforeEach(() => {
    req = {};
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockListContacts = jest.fn();
    (contactController as jest.Mock).mockImplementation(() => ({
      listContacts: mockListContacts,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the listContacts method from contactController with req and res', () => {
    listContactFactory(req as Request, res as Response);

    expect(mockListContacts).toHaveBeenCalledWith(req, res);
  });

  it('should initialize repositories and services correctly', () => {
    listContactFactory(req as Request, res as Response);

    expect(contactRepository).toHaveBeenCalledTimes(1);
    expect(userRepository).toHaveBeenCalledTimes(1);
    expect(contactService).toHaveBeenCalledWith(
      expect.any(contactRepository),
      expect.any(userRepository)
    );
  });
});
