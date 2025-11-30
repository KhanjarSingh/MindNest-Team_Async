-- AlterTable
ALTER TABLE `Idea` ADD COLUMN `fundingAmount` INTEGER NULL,
    ADD COLUMN `note` TEXT NULL,
    ADD COLUMN `score` INTEGER NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'under_review',
    ADD COLUMN `tags` VARCHAR(191) NULL,
    ADD COLUMN `userId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `ideas_userId_fkey` ON `Idea`(`userId`);

-- AddForeignKey
ALTER TABLE `Idea` ADD CONSTRAINT `Idea_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
