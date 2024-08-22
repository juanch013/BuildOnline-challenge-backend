import {Request} from 'express';
import MyJwtPayload from './jwtPayload';

export interface IRequest extends Request{
    loggedUser?:MyJwtPayload
}