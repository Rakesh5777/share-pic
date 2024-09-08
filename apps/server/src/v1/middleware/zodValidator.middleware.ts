import { CustomError } from "../utils/error";
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
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      throw new CustomError("BAD_REQUEST", "zodValidationErr", error?.errors);
    }
  };
};
