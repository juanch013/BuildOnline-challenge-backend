import { noteData } from './../../../src/notes/interfaces/noteData';
import { BaseResponse } from './BaseResponse';

export default interface ListNotesResponse extends BaseResponse<noteData[] | {} >{}