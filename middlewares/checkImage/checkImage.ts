import { Request, Response, NextFunction } from 'express';

export default function checkFile(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return res.status(400).json({
      code: 400,
      message: 'Must be an image attached for the creation of the contact, please attach an image.',
      data:{}
    });
  }

  next();
}