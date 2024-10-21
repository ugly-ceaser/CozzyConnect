/*
  Warnings:

  - You are about to drop the `reminders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "reminders" DROP CONSTRAINT "reminders_userId_fkey";

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Nigeria';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "country" TEXT DEFAULT 'Nigeria';

-- DropTable
DROP TABLE "reminders";

-- CreateTable
CREATE TABLE "Reminder" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "note" TEXT NOT NULL,
    "appointmentContactNumber" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "real_estate_interests" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "state" TEXT[],
    "lga" TEXT[],
    "country" TEXT[],

    CONSTRAINT "real_estate_interests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Reminder_userId_idx" ON "Reminder"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "real_estate_interests_userId_key" ON "real_estate_interests"("userId");

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "real_estate_interests" ADD CONSTRAINT "real_estate_interests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
