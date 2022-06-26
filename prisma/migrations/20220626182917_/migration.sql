-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('PROGRAMMING', 'MARKETING', 'CONTENT', 'DESIGN');

-- CreateTable
CREATE TABLE "Camper" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "camperId" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "firebaseId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "firstNameEn" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "lastNameEn" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "branch" "BranchType" NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "emergencyFirstName" TEXT NOT NULL,
    "emergencyLastName" TEXT NOT NULL,
    "emergencyTelephone" TEXT NOT NULL,
    "emergencyRelationship" TEXT NOT NULL,
    "parentFirstName" TEXT NOT NULL,
    "parentLastName" TEXT NOT NULL,
    "parentTelephone" TEXT NOT NULL,
    "parentRelationship" TEXT NOT NULL,
    "healthAllergicDrug" TEXT,
    "healthAllergicThing" TEXT,
    "healthCongenitalDisease" TEXT,
    "healthDietaryRestriction" TEXT,
    "healthDrug" TEXT,
    "teamId" UUID,

    CONSTRAINT "Camper_pkey" PRIMARY KEY ("id","discordId","firebaseId","camperId")
);

-- CreateTable
CREATE TABLE "UnregisteredCamper" (
    "firebaseId" TEXT NOT NULL,

    CONSTRAINT "UnregisteredCamper_pkey" PRIMARY KEY ("firebaseId")
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

-- AddForeignKey
ALTER TABLE "Camper" ADD CONSTRAINT "Camper_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
