import { BaseResponse } from './BaseResponse';
import userData from '../../../src/auth/interfaces/userData'

export default interface GetUserResponse extends BaseResponse<userData | {} >{}