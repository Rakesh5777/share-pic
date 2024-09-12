import { NextFunction, Request, Response } from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Function to create a new folder for each request
const createFolder = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const generateFolderMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const parentFolderPath = process.env.UPLOADS_FOLDER; // Get parent folder path from environment variable
  const uniqueId = uuidv4();
  const uniqueFolder = `${parentFolderPath}/${uniqueId}`; // Generate unique folder name
  createFolder(uniqueFolder); // Create folder
  req.folderId = uniqueId; // Store unique folder ID in request object
  req.folderPath = uniqueFolder; // Store folder path in request object
  next();
};

export default generateFolderMiddleware;
