export type SaveImagesResponse = {
  success: boolean;
  message: string;
  data: ImageGroupData;
};

export type ImageGroupData = {
  id: string;
  expiryDate: Date;
  createdAt: Date;
};

export type ImageData = {
  filePath: string;
  fileName: string;
};
