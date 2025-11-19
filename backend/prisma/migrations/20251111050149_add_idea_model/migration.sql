-- CreateTable
CREATE TABLE `Idea` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `pitch` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `demoLink` VARCHAR(191) NULL,
    `pitchDeckUrl` VARCHAR(191) NULL,
    `ppt_Url` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
