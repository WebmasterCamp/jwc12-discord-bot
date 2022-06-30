-- CreateTable
CREATE TABLE "GuildMetadata" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guildId" TEXT NOT NULL,
    "giverRole" TEXT,
    "staffRole" TEXT,
    "camperRole" TEXT,
    "adminRole" TEXT,

    CONSTRAINT "GuildMetadata_pkey" PRIMARY KEY ("id")
);
