/*
  Warnings:

  - You are about to drop the column `votes` on the `Comment` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VoteDirection" AS ENUM ('UP', 'DOWN', 'UNVOTE');

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "votes";

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "voterId" TEXT NOT NULL,
    "commentId" TEXT,
    "topicId" TEXT,
    "direction" "VoteDirection" NOT NULL DEFAULT 'UNVOTE',

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
