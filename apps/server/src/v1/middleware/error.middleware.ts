import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { generateErrorMessage } from "zod-error";
import {
  getCauseFromError,
  getErrorFieldsFromError,
} from "../utils/commonUtils";
import { CustomError, ERROR_CODE } from "../utils/error";
import { deleteFolder } from "../utils/handleFolders";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(typeof err);
  console.error(err);
  if (err instanceof CustomError) {
    return handleCustomError(err, req, res);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(err, res);
  } else if (err instanceof ZodError) {
    return handleZodError(err, res);
  }

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

const handleCustomError = (err: CustomError, req: Request, res: Response) => {
  switch (err.name) {
    case "INVALID_FILE_TYPE":
      deleteFolder(req.folderPath);
      return res.status(err.code).json({ message: err.message, error: err });
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

const handleZodError = (err: ZodError, res: Response) => {
  const error = {
    name: err.name,
    message: generateErrorMessage(err.issues, {
      maxErrors: 2,
      delimiter: {
        component: ": ",
      },
      message: {
        enabled: true,
        label: "",
      },
      path: {
        enabled: true,
        label: "",
        type: "breadcrumbs",
        arraySquareBrackets: false,
      },
      code: {
        enabled: false,
      },
    }),
    code: ERROR_CODE.UNPROCESSABLE_ENTITY,
    status: false,
  };

  return res.status(error.code).json({
    message: error.message,
    error: error,
  });
};
