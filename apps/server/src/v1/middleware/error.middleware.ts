import { Request, Response, NextFunction } from "express";
import {
  getCauseFromError,
  getErrorFieldsFromError,
} from "../utils/commonUtils";
import { CustomError } from "../utils/error";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(
    "---------------------------------------------------------------"
  );
  console.error(err);
  if (err instanceof CustomError) {
    return handleCustomError(err, res);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  }
  console.log(
    "something asdfosdanflkadsfjlkasdjf alsdkjf adsklfjklasd fkalsdjflksdjflkasdj fsd ---------------------------"
  );
  if (err.status || err.code) {
    return res.status(err.status || err.code).json({
      message: err.message || "Validation error",
      error: err.errors || undefined, // OpenApiValidator may attach detailed validation errors
    });
  }

  return res.status(500).json({
    message: "An error occurred while processing your request",
    error: err,
  });
};

const handleCustomError = (err: CustomError, res: Response) => {
  switch (err.name) {
    // case "zodValidationErr":
    //   return res
    //     .status(err.statusCode)
    //     .json({ message: "Bad request", error: err.error });
    default:
      return res.status(err.code).json({ message: err.message, error: err });
  }
};

const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
  res: Response
) => {
  switch (err.code) {
    case "P2002":
      return res.status(409).json({
        message: `Duplicate field value entered for ${getErrorFieldsFromError(err)}`,
        error: err,
      });
    case "P1001":
    case "P2024":
      return res.status(408).json({ message: "Request timeout", error: err });
    default:
      return res
        .status(400)
        .json({ message: `${getCauseFromError(err)}`, error: err });
  }
};
