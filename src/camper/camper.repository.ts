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

  async getByDiscordId(discordId: string) {
    const account = await this.prisma.discordAccount.findUnique({
      include: { Camper: { include: { Team: true } } },
      where: { discordId },
    })
    if (!account) return null
    return account.Camper
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

  async transferCoin(fromId: string, toId: string, amount: number) {
    await this.prisma.$transaction([
      this.prisma.camper.update({
        select: { coins: true },
        where: { id: fromId },
        data: { coins: { decrement: amount } },
      }),
      this.prisma.camper.update({
        select: { coins: true },
        where: { id: toId },
        data: { coins: { increment: amount } },
      }),
    ])
  }

  async findByVerifyCode(verifyCode: string) {
    const camper = await this.prisma.camper.findFirst({
      select: { id: true, nickname: true, branch: true },
      where: {
        firebaseId: {
          startsWith: verifyCode,
        },
      },
    })
    return camper ?? null
  }

  async associateToDiscordId(camperId: string, discordId: string) {
    await this.prisma.camper.update({
      data: {
        discordAccounts: {
          create: { discordId: discordId },
        },
      },
      where: { id: camperId },
    })
  }
}
