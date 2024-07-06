/*
  Warnings:

  - The `passportPhoto` column on the `UserKyc` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserKyc" DROP COLUMN "passportPhoto",
ADD COLUMN     "passportPhoto" TEXT[];
