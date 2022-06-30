/*
  Warnings:

  - You are about to drop the column `discordId` on the `Camper` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Camper_discordId_key";

-- AlterTable
ALTER TABLE "Camper" DROP COLUMN "discordId";

-- CreateTable
CREATE TABLE "DiscordAccount" (
    "discordId" TEXT NOT NULL,
    "camperId" UUID NOT NULL,

    CONSTRAINT "DiscordAccount_pkey" PRIMARY KEY ("discordId")
);

-- AddForeignKey
ALTER TABLE "DiscordAccount" ADD CONSTRAINT "DiscordAccount_camperId_fkey" FOREIGN KEY ("camperId") REFERENCES "Camper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
