/*
  Warnings:

  - You are about to drop the column `ActivityId` on the `UserOnActivity` table. All the data in the column will be lost.
  - Added the required column `activityId` to the `UserOnActivity` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserOnActivity" DROP CONSTRAINT "UserOnActivity_ActivityId_fkey";

-- AlterTable
ALTER TABLE "UserOnActivity" DROP COLUMN "ActivityId",
ADD COLUMN     "activityId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "UserOnActivity" ADD CONSTRAINT "UserOnActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
