import { Request, Response } from 'express';
import { contactRepository } from '../../../../src/repositories/repositories/contactRepository';
import { userRepository } from '../../../../src/repositories/repositories/userRepository';
import { contactService } from '../../../../src/contact/services/contactService';
import contactController from '../../../../src/contact/controller/contactController';
import updateContactFactory from '../../../../src/contact/controller/factories/updateContactFactory';

jest.mock('../../../../src/repositories/repositories/contactRepository');
jest.mock('../../../../src/repositories/repositories/userRepository');
jest.mock('../../../../src/contact/services/contactService');
jest.mock('../../../../src/contact/controller/contactController');


describe('updateContactFactory', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockUpdateContact: jest.Mock;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUpdateContact = jest.fn();
    (contactController as jest.Mock).mockImplementation(() => ({
      updateContact: mockUpdateContact,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the updateContact method from contactController with req and res', () => {
    updateContactFactory(req as Request, res as Response);

    expect(mockUpdateContact).toHaveBeenCalledWith(req, res);
  });

  it('should initialize repositories and services correctly', () => {
    updateContactFactory(req as Request, res as Response);

    expect(contactRepository).toHaveBeenCalledTimes(1);
    expect(userRepository).toHaveBeenCalledTimes(1);
    expect(contactService).toHaveBeenCalledWith(
      expect.any(contactRepository),
      expect.any(userRepository)
    );
  });
});