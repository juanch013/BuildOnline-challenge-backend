import { UnautorizedError } from './../../common/errors/errors';
import { NextFunction, Request,Response } from "express";
import * as jwt from 'jsonwebtoken'
import {config} from 'dotenv'
import { IRequest } from '../../common/types/modifyesTypes/modifyedRequest';
import MyJwtPayload from '../../common/types/modifyesTypes/jwtPayload'
config();

export default function verifyToken(req:IRequest, res:Response, next:NextFunction) {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(UnautorizedError.code).json(UnautorizedError);
    }

    const secret = process.env.JWT_SECRET;

    if(!secret){
        return res.status(UnautorizedError.code).json(UnautorizedError);
    }

    try {
      const payload = jwt.verify(token, secret,{}) as MyJwtPayload;
      req.loggedUser = payload;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Token not valid" });
    }
  }