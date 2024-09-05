import { Request, Response } from 'express';
import contactController from "../../../../src/contact/controller/contactController"
import createContactFactory from "../../../../src/contact/controller/factories/createContactFactory"
import  {contactRepository}  from '../../../../src/repositories/repositories/contactRepository';
import { userRepository } from '../../../../src/repositories/repositories/userRepository';
import { contactService } from '../../../../src/contact/services/contactService';

jest.mock('../../../../src/repositories/repositories/contactRepository');
jest.mock('../../../../src/repositories/repositories/userRepository');
jest.mock('../../../../src/contact/services/contactService');
jest.mock('../../../../src/contact/controller/contactController');

describe('createContactFactory', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockCreateContact: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockCreateContact = jest.fn();
    (contactController as jest.Mock).mockImplementation(() => ({
      createContact: mockCreateContact,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call createContact method from contactController', () => {
    createContactFactory(req as Request, res as Response);

    expect(mockCreateContact).toHaveBeenCalledWith(req, res);
  });

  it('should initialize repositories and services correctly', () => {
    createContactFactory(req as Request, res as Response);

    expect(contactRepository).toHaveBeenCalledTimes(1);
    expect(userRepository).toHaveBeenCalledTimes(1);
    expect(contactService).toHaveBeenCalledWith(
      expect.any(contactRepository),
      expect.any(userRepository)
    );
  });
});
