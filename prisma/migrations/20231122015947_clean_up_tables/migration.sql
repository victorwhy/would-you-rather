/*
  Warnings:

  - You are about to drop the column `votes` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title]` on the table `Topic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_userId_fkey";

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "votes",
ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "Note";

-- CreateIndex
CREATE UNIQUE INDEX "Topic_title_key" ON "Topic"("title");
