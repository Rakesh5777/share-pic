import { NextFunction, Request, Response } from "express";

export const zodValidatorMiddleware = (schema: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
};
