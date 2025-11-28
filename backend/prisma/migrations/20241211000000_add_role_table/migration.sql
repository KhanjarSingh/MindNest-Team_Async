-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `roleId` INTEGER NOT NULL DEFAULT 0;

-- DropColumn
ALTER TABLE `User` DROP COLUMN `role`;

-- CreateIndex
CREATE INDEX `User_roleId_fkey` ON `User`(`roleId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;