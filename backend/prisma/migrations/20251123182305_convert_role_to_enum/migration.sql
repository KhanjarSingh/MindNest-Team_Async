/*
  Warnings:

  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_role_id_fkey`;

-- DropIndex
DROP INDEX `User_role_id_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `role_id`,
    ADD COLUMN `role` ENUM('PARTICIPANT', 'ADMIN') NOT NULL DEFAULT 'PARTICIPANT';

-- DropTable
DROP TABLE `Role`;
