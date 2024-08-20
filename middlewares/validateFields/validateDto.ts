import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validateDto(dtoClass: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);

    validate(dtoInstance).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
        return res.status(400).json({ message: 'Validation failed', errors: errorMessages });
      } else {
        req.body = dtoInstance;
        next();
      }
    });
  };
}
