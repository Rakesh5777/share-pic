import { NextFunction, Request, Response } from "express";

type AsyncWrapperType = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncWrapper = (schema: any): AsyncWrapperType => {
  return function (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return function (req: Request, res: Response, next: NextFunction) {
      return fn(req, res, next).catch(next);
    };
  };
};

export const zodValidatorMiddleware = (schema: any) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse(req.body);
    next();
  };
};
