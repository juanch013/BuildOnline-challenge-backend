import { Request, Response } from 'express';
import { contactRepository } from '../../../../src/repositories/repositories/contactRepository';
import { noteRepository } from '../../../../src/repositories/repositories/noteRepository';
import NoteService from '../../../../src/notes/service/noteService';
import { userRepository } from '../../../../src/repositories/repositories/userRepository';
import NoteController from '../../../../src/notes/controller/noteController';
import createNoteFactory from '../../../../src/notes/controller/factories/createNoteFactory';

jest.mock('../../../../src/repositories/repositories/contactRepository');
jest.mock('../../../../src/repositories/repositories/noteRepository');
jest.mock('../../../../src/repositories/repositories/userRepository');
jest.mock('../../../../src/notes/service/noteService');
jest.mock('../../../../src/notes/controller/noteController');

describe('createNoteFactory', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockCreateNote: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockCreateNote = jest.fn();
    (NoteController as jest.Mock).mockImplementation(() => ({
      createNote: mockCreateNote,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the createNote method from NoteController with req and res', () => {
    createNoteFactory(req as Request, res as Response);

    expect(mockCreateNote).toHaveBeenCalledWith(req, res);
  });

  it('should initialize repositories and services correctly', () => {
    createNoteFactory(req as Request, res as Response);

    expect(noteRepository).toHaveBeenCalledTimes(1);
    expect(contactRepository).toHaveBeenCalledTimes(1);
    expect(userRepository).toHaveBeenCalledTimes(1);
    expect(NoteService).toHaveBeenCalledWith(
      expect.any(noteRepository),
      expect.any(userRepository),
      expect.any(contactRepository)
    );
  });
});
