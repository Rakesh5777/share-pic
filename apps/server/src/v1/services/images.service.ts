import { Request } from "express";
import { deleteFolder } from "../utils/handleFolders";
import { CustomError } from "../utils/error";
import { createImageGroup } from "../scripts/images.script";

export async function saveImages(request: Request) {
  try {
    const { files, folderId } = request;
    const { expiryDate } = request.body;

    const imageGroup = {
      id: folderId,
      expiryDate: new Date(expiryDate),
      createdAt: new Date(),
    };

    const images = (files as Express.Multer.File[]).map((file) => ({
      filePath: file.path,
    }));

    const data = await createImageGroup(imageGroup, images);

    return {
      success: true,
      message: "Images saved successfully",
      data,
    };
  } catch (error) {
    deleteFolder(request.folderPath);
    throw new CustomError(
      "INTERNAL_SERVER_ERROR",
      "Failed to save images in DB"
    );
  }
}
