/*
  Warnings:

  - Added the required column `userId` to the `Idea` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Idea` ADD COLUMN `fundingAmount` INTEGER NULL,
    ADD COLUMN `note` TEXT NULL,
    ADD COLUMN `score` INTEGER NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'under_review',
    ADD COLUMN `tags` JSON NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Idea` ADD CONSTRAINT `Idea_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
