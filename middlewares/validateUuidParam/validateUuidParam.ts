import { Request, Response, NextFunction } from 'express';
import { validate } from 'uuid';

const validateUuidParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.params[paramName];

    if (!uuid || !validate(uuid)) {
      return res.status(400).json({
        code: 400,
        message: `Param ${paramName} must be an UUID`,
        data: {},
      });
    }

    next();
  };
};

export default validateUuidParam;