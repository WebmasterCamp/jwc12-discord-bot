/*
  Warnings:

  - You are about to drop the column `adminRole` on the `GuildMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `camperRole` on the `GuildMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `giverRole` on the `GuildMetadata` table. All the data in the column will be lost.
  - You are about to drop the column `staffRole` on the `GuildMetadata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GuildMetadata" DROP COLUMN "adminRole",
DROP COLUMN "camperRole",
DROP COLUMN "giverRole",
DROP COLUMN "staffRole";

-- CreateTable
CREATE TABLE "GuildRole" (
    "guildId" TEXT NOT NULL,
    "roleKey" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "GuildRole_pkey" PRIMARY KEY ("guildId","roleKey")
);

-- AddForeignKey
ALTER TABLE "GuildRole" ADD CONSTRAINT "GuildRole_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "GuildMetadata"("guildId") ON DELETE RESTRICT ON UPDATE CASCADE;
