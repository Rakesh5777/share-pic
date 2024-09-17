import { ImageGroup } from "@prisma/client";
import { prisma } from "../..";
import { ImageData, ImageGroupData } from "../types/images.types";

export const createImageGroup = async (
  imageGroup: ImageGroup,
  images: { filePath: string; fileName: string }[]
): Promise<ImageGroupData> => {
  const response = await prisma.imageGroup.create({
    data: {
      ...imageGroup,
      images: {
        create: images,
      },
    },
  });

  return response;
};

export const getImagesQuery = async (groupId: string): Promise<ImageData[]> => {
  const images = await prisma.image.findMany({
    where: {
      groupId,
    },
    select: {
      filePath: true,
      fileName: true,
    },
  });

  return images;
};

export const getExpiredImageGroupsIds = async (): Promise<string[]> => {
  const expiredGroups = await prisma.imageGroup.findMany({
    where: {
      expiryDate: {
        lte: new Date(),
      },
    },
    select: {
      id: true,
    },
  });

  return expiredGroups.map((group) => group.id);
};

export const deleteExpiredImageGroupsInDb = async (): Promise<void> => {
  await prisma.imageGroup.deleteMany({
    where: {
      expiryDate: {
        lte: new Date(),
      },
    },
  });
};