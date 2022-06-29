/*
  Warnings:

  - The primary key for the `Camper` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Camper" DROP CONSTRAINT "Camper_pkey",
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "camperId" DROP NOT NULL,
ALTER COLUMN "discordId" DROP NOT NULL,
ALTER COLUMN "firebaseId" DROP NOT NULL,
ADD CONSTRAINT "Camper_pkey" PRIMARY KEY ("id");
