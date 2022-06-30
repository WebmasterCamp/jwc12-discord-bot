/*
  Warnings:

  - You are about to drop the column `camperId` on the `Camper` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[camperCode]` on the table `Camper` will be added. If there are existing duplicate values, this will fail.
  - Made the column `points` on table `Camper` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Camper_camperId_key";

-- AlterTable
ALTER TABLE "Camper" DROP COLUMN "camperId",
ADD COLUMN     "camperCode" TEXT,
ALTER COLUMN "points" SET NOT NULL;

-- CreateTable
CREATE TABLE "CoreQuestion" (
    "camperId" UUID NOT NULL,
    "question1" TEXT,
    "question2" TEXT,
    "question3" TEXT,
    "question4" TEXT,

    CONSTRAINT "CoreQuestion_pkey" PRIMARY KEY ("camperId")
);

-- CreateTable
CREATE TABLE "ProgrammingQuestion" (
    "camperId" UUID NOT NULL,
    "question1" TEXT,
    "question2" TEXT,

    CONSTRAINT "ProgrammingQuestion_pkey" PRIMARY KEY ("camperId")
);

-- CreateTable
CREATE TABLE "ContentQuestion" (
    "camperId" UUID NOT NULL,
    "question1" TEXT,
    "question2" TEXT,
    "question3" TEXT,

    CONSTRAINT "ContentQuestion_pkey" PRIMARY KEY ("camperId")
);

-- CreateTable
CREATE TABLE "DesignQuestion" (
    "camperId" UUID NOT NULL,
    "question1" TEXT,
    "question2" TEXT,
    "question3" TEXT,

    CONSTRAINT "DesignQuestion_pkey" PRIMARY KEY ("camperId")
);

-- CreateTable
CREATE TABLE "MarketingQuestion" (
    "camperId" UUID NOT NULL,
    "question1" TEXT,
    "question2" TEXT,
    "question3" TEXT,
    "question4" TEXT,

    CONSTRAINT "MarketingQuestion_pkey" PRIMARY KEY ("camperId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Camper_camperCode_key" ON "Camper"("camperCode");

-- AddForeignKey
ALTER TABLE "CoreQuestion" ADD CONSTRAINT "CoreQuestion_camperId_fkey" FOREIGN KEY ("camperId") REFERENCES "Camper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgrammingQuestion" ADD CONSTRAINT "ProgrammingQuestion_camperId_fkey" FOREIGN KEY ("camperId") REFERENCES "Camper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentQuestion" ADD CONSTRAINT "ContentQuestion_camperId_fkey" FOREIGN KEY ("camperId") REFERENCES "Camper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignQuestion" ADD CONSTRAINT "DesignQuestion_camperId_fkey" FOREIGN KEY ("camperId") REFERENCES "Camper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketingQuestion" ADD CONSTRAINT "MarketingQuestion_camperId_fkey" FOREIGN KEY ("camperId") REFERENCES "Camper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
