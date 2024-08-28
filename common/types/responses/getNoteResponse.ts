import { noteData } from './../../../src/notes/interfaces/noteData';
import { BaseResponse } from './BaseResponse';

export default interface GetNoteResponse extends BaseResponse<noteData | {} >{}