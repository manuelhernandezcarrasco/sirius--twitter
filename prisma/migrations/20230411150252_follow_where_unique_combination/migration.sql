/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `Follow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[followedId,followerId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "deletedAt";

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followedId_followerId_key" ON "Follow"("followedId", "followerId");
