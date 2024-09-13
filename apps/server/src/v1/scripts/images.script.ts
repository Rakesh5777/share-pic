import { ImageGroup } from "@prisma/client";
import { prisma } from "../..";

export const createImageGroup = async (
  imageGroup: ImageGroup,
  images: { filePath: string; fileName: string }[]
) => {
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

export const getImagesQuery = async (groupId: string) => {
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