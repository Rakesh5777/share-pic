-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_groupId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ImageGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
