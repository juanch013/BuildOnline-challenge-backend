import { Request, Response } from 'express';
import { contactRepository } from '../../../../src/repositories/repositories/contactRepository';
import { noteRepository } from '../../../../src/repositories/repositories/noteRepository';
import NoteService from '../../../../src/notes/service/noteService';
import { userRepository } from '../../../../src/repositories/repositories/userRepository';
import NoteController from '../../../../src/notes/controller/noteController';
import listNoteFactory from '../../../../src/notes/controller/factories/listNotesFactory';

jest.mock('../../../../src/repositories/repositories/contactRepository');
jest.mock('../../../../src/repositories/repositories/noteRepository');
jest.mock('../../../../src/repositories/repositories/userRepository');
jest.mock('../../../../src/notes/service/noteService');
jest.mock('../../../../src/notes/controller/noteController');

describe('listNoteFactory', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockListNotes: jest.Mock;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockListNotes = jest.fn();
    (NoteController as jest.Mock).mockImplementation(() => ({
      listNotes: mockListNotes,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the listNotes method from NoteController with req and res', () => {
    listNoteFactory(req as Request, res as Response);

    expect(mockListNotes).toHaveBeenCalledWith(req, res);
  });

  it('should initialize repositories and services correctly', () => {
    listNoteFactory(req as Request, res as Response);

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
