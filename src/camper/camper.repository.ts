import { Injectable, Logger } from '@nestjs/common'

import { Prisma } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

import { CoinUpdateMeta } from './coin-update-meta'

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

  async incrementCoinByIds(camperIds: string[], amount: number, meta: CoinUpdateMeta) {
    const ids = [...new Set(camperIds)]
    const metadata = meta as unknown as Prisma.JsonObject
    await this.prisma.$transaction([
      this.prisma.camper.updateMany({
        where: { id: { in: camperIds } },
        data: { coins: { increment: amount } },
      }),
      this.prisma.coinUpdate.createMany({
        data: ids.map((id) => ({ camperId: id, amount, metadata })),
      }),
    ])
  }

  async getCoinsById(camperId: string): Promise<number> {
    const camper = await this.prisma.camper.findUnique({
      select: { coins: true },
      where: { id: camperId },
      rejectOnNotFound: true,
    })
    return camper.coins
  }

  async getCoinsByIds(camperIds: string[]): Promise<number> {
    const campers = await this.prisma.camper.findMany({
      select: { coins: true },
      where: { id: { in: camperIds } },
    })
    return campers.reduce((sum, camper) => sum + camper.coins, 0)
  }

  async transferCoin(
    fromId: string,
    toId: string,
    fromMeta: CoinUpdateMeta,
    toMeta: CoinUpdateMeta,
    amount: number
  ) {
    await this.prisma.$transaction([
      this.prisma.camper.update({
        select: { coins: true },
        where: { id: fromId },
        data: {
          coins: { decrement: amount },
          coinUpdates: {
            create: [
              {
                amount: -amount,
                metadata: fromMeta as unknown as Prisma.JsonObject,
              },
            ],
          },
        },
      }),
      this.prisma.camper.update({
        select: { coins: true },
        where: { id: toId },
        data: {
          coins: { increment: amount },
          coinUpdates: {
            create: [
              {
                amount: amount,
                metadata: toMeta as unknown as Prisma.JsonObject,
              },
            ],
          },
        },
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

  async getTopCoinsIndividual() {
    return await this.prisma.camper.findMany({
      select: { nickname: true, branch: true, coins: true },
      orderBy: { coins: 'desc' },
      take: 6,
    })
  }

  async getTopCoinsBranch() {
    return await this.prisma.camper.groupBy({
      by: ['branch'],
      _sum: {
        coins: true,
      },
      orderBy: {
        _sum: {
          coins: 'desc',
        },
      },
    })
  }

  async getStealCount(uid: string): Promise<number> {
    const data = await this.prisma.coinUpdate.count({
      select: { amount: true },
      where: {
        camperId: uid,
        amount: { gt: 0 },
      },
    })
    console.log(data)
    return data.amount
  }
}
