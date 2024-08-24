import { Request, Response, NextFunction } from 'express';

const validateNumberParam = (paramNames: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    for(const paramName of paramNames){
        const param = req.query[paramName];

        const numberParam = Number(param)

        if (isNaN(numberParam) && param !== undefined) {
          return res.status(400).json({
            code: 400,
            message: `Param ${paramName} must be an number`,
            data: {},
          });
        }

    }
    next();
  };
};

export default validateNumberParam;