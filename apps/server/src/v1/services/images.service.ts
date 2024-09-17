import { Request, Response } from "express";
import { checkImagesInFolder, deleteFolder } from "../utils/handleFolders";
import { CustomError } from "../utils/error";
import { createImageGroup, getImagesQuery } from "../scripts/images.script";
import { constants } from "../utils/constants";

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
      fileName: file.filename,
      filePath: `${folderId}/${file.filename}`,
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

export async function getImages(req: Request, res: Response) {
  const { groupId } = req.params; // Extract group ID from request parameters

  // check if images present in folder
  const folderName = process.env.UPLOADS_FOLDER + "/" + groupId;
  if (!checkImagesInFolder(folderName)) {
    throw new CustomError(
      "NOT_FOUND",
      "Invalid Group Id or Group Id has expired"
    );
  }

  const images = await getImagesQuery(groupId);
  images.forEach((image) => {
    image.filePath = `${req.protocol}://${req.get("host")}/${constants.staticFolder}/${image.filePath}`; // static image path
  });
  return images;
}