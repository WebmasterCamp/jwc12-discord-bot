/*
  Warnings:

  - You are about to drop the `UnregisteredCamper` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "UnregisteredCamper";

-- CreateTable
CREATE TABLE "AllowedCamper" (
    "firebaseId" TEXT NOT NULL,

    CONSTRAINT "AllowedCamper_pkey" PRIMARY KEY ("firebaseId")
);
