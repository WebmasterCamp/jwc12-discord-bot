/*
  Warnings:

  - The primary key for the `GuildMetadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GuildMetadata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GuildMetadata" DROP CONSTRAINT "GuildMetadata_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "GuildMetadata_pkey" PRIMARY KEY ("guildId");
