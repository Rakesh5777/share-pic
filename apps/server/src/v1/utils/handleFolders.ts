import fs from "fs";

export const createFolder = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

export const deleteFolder = (folderPath: string) => {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true });
  }
};

export const checkImagesInFolder = (folderPath: string) => {
  return fs.existsSync(folderPath);
};