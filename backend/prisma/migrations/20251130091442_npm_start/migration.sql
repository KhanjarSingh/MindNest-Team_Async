/*
  Warnings:

  - You are about to drop the column `fundingAmount` on the `Idea` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Idea` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Idea` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Idea` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Idea` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Idea` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Idea` DROP FOREIGN KEY `Idea_userId_fkey`;

-- AlterTable
ALTER TABLE `Idea` DROP COLUMN `fundingAmount`,
    DROP COLUMN `note`,
    DROP COLUMN `score`,
    DROP COLUMN `status`,
    DROP COLUMN `tags`,
    DROP COLUMN `userId`;
