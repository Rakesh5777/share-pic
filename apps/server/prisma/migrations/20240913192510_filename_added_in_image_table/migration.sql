/*
  Warnings:

  - Added the required column `fileName` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "fileName" TEXT NOT NULL DEFAULT '';
