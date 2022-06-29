-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('PROGRAMMING', 'MARKETING', 'CONTENT', 'DESIGN');

-- CreateTable
CREATE TABLE "Camper" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "camperId" TEXT,
    "discordId" TEXT,
    "firebaseId" TEXT,
    "citizenId" TEXT,
    "firstName" TEXT,
    "firstNameEn" TEXT,
    "lastName" TEXT,
    "lastNameEn" TEXT,
    "nickname" TEXT,
    "telephone" TEXT,
    "branch" "BranchType",
    "points" INTEGER DEFAULT 0,
    "emergencyFirstName" TEXT,
    "emergencyLastName" TEXT,
    "emergencyTelephone" TEXT,
    "emergencyRelationship" TEXT,
    "parentFirstName" TEXT,
    "parentLastName" TEXT,
    "parentTelephone" TEXT,
    "parentRelationship" TEXT,
    "healthAllergicDrug" TEXT,
    "healthAllergicThing" TEXT,
    "healthCongenitalDisease" TEXT,
    "healthDietaryRestriction" TEXT,
    "healthDrug" TEXT,
    "teamId" UUID,

    CONSTRAINT "Camper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Camper_email_key" ON "Camper"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Camper_camperId_key" ON "Camper"("camperId");

-- CreateIndex
CREATE UNIQUE INDEX "Camper_discordId_key" ON "Camper"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "Camper_firebaseId_key" ON "Camper"("firebaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Camper_citizenId_key" ON "Camper"("citizenId");

-- AddForeignKey
ALTER TABLE "Camper" ADD CONSTRAINT "Camper_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
