-- CreateTable
CREATE TABLE "CoinUpdate" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "camperId" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,

    CONSTRAINT "CoinUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoinUpdate" ADD CONSTRAINT "CoinUpdate_camperId_fkey" FOREIGN KEY ("camperId") REFERENCES "Camper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
