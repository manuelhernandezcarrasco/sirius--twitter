-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "fatherPostId" UUID;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_fatherPostId_fkey" FOREIGN KEY ("fatherPostId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
