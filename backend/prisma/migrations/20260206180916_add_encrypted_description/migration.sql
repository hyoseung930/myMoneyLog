-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `encrypted_description` TEXT NULL,
    ADD COLUMN `description_iv` VARCHAR(100) NULL;
