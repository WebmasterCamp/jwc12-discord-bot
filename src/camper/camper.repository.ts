import { Injectable, Logger } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class CamperRepository {
  private readonly logger = new Logger(CamperRepository.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${CamperRepository.name} initialized`)
  }

  async getIdByDiscordId(discordId: string): Promise<string | null> {
    const account = await this.prisma.discordAccount.findUnique({
      where: { discordId },
    })
    if (!account) return null
    return account.camperId
  }

  async getIdsByDiscordIds(discordIds: string[]): Promise<string[]> {
    const accounts = await this.prisma.discordAccount.findMany({
      where: { discordId: { in: discordIds } },
    })
    return accounts.map((account) => account.camperId)
  }

  async incrementCoinByIds(camperIds: string[], amount: number) {
    await this.prisma.camper.updateMany({
      where: { id: { in: camperIds } },
      data: { coins: { increment: amount } },
    })
  }

  async getCoinsById(camperId: string): Promise<number> {
    const camper = await this.prisma.camper.findUnique({
      select: { coins: true },
      where: { id: camperId },
      rejectOnNotFound: true,
    })
    return camper.coins
  }
}
