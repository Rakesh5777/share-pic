import { ImageGroup } from "@prisma/client";
import { prisma } from "../..";

export const createImageGroup = async (
  imageGroup: ImageGroup,
  images: { filePath: string }[]
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
