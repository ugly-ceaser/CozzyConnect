-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "houseName" TEXT;

-- CreateTable
CREATE TABLE "usersinfo" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "profilePicture" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usersinfo_pkey" PRIMARY KEY ("id")
);
