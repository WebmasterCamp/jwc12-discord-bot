/*
  Warnings:

  - You are about to drop the column `points` on the `Camper` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Camper" DROP COLUMN "points",
ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0;
