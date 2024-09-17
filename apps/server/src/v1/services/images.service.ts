import { Request } from "express";
import { checkImagesInFolder, deleteFolder } from "../utils/handleFolders";
import { CustomError } from "../utils/error";
import {
  createImageGroup,
  deleteExpiredImageGroupsInDb,
  getExpiredImageGroupsIds,
  getImagesQuery,
} from "../scripts/images.script";
import { constants } from "../utils/constants";
import { ImageData, SaveImagesResponse } from "../types/images.types";
import { log } from "console";

export async function saveImages(
  request: Request
): Promise<SaveImagesResponse> {
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

export async function getImages(req: Request): Promise<ImageData[]> {
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

export async function deleteExpiredImageGroups(): Promise<void> {
  // Get expired image groups
  const expiredGroups = await getExpiredImageGroupsIds();
  log("Expired groups", expiredGroups);
  // Delete expired image groups
  await deleteImageGroups(expiredGroups);
  // Delete expired image groups from DB
  await deleteExpiredImageGroupsInDb();
}

export async function deleteImageGroups(groupId: string[]): Promise<void> {
  for (const id of groupId) {
    const folderName = process.env.UPLOADS_FOLDER + "/" + id;
    deleteFolder(folderName);
  }
}
