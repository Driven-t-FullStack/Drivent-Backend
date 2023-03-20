/*
  Warnings:

  - You are about to drop the column `vacancies` on the `Activity` table. All the data in the column will be lost.
  - Added the required column `capacity` to the `Hall` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "vacancies";

-- AlterTable
ALTER TABLE "Hall" ADD COLUMN     "capacity" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "UserOnActivity" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ActivityId" INTEGER NOT NULL,

    CONSTRAINT "UserOnActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserOnActivity" ADD CONSTRAINT "UserOnActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnActivity" ADD CONSTRAINT "UserOnActivity_ActivityId_fkey" FOREIGN KEY ("ActivityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
