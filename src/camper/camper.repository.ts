import { Injectable, Logger } from '@nestjs/common'

import { Prisma } from '@prisma/client'
import { branchAbbreviations } from 'src/discord-bot/utils/constants'
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
      select: { id: true, nickname: true, branch: true, Team: { select: { roleKey: true } } },
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
      take: 10,
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

  async getTopStealer() {
    const data = await this.prisma.coinUpdate.findMany({
      select: { metadata: true, Camper: { select: { nickname: true, branch: true } } },
    })
    const stealData = data.reduce((result, coinUpdate) => {
      const metadata = coinUpdate.metadata as unknown as CoinUpdateMeta
      if (metadata.type === 'steal' || metadata.type === 'give-steal-penalty') {
        const name = `[${branchAbbreviations[coinUpdate.Camper.branch]}] ${
          coinUpdate.Camper.nickname
        }`
        result[name] = (result[name] ?? 0) + 1
      }
      return result
    }, {} as Record<string, number>)
    return stealData
  }

  async getTopStolen() {
    const data = await this.prisma.coinUpdate.findMany({
      select: { metadata: true, Camper: { select: { nickname: true, branch: true } } },
    })
    const stealData = data.reduce((result, coinUpdate) => {
      const metadata = coinUpdate.metadata as unknown as CoinUpdateMeta
      if (metadata.type === 'stolen' || metadata.type === 'given-steal-penalty') {
        const name = `[${branchAbbreviations[coinUpdate.Camper.branch]}] ${
          coinUpdate.Camper.nickname
        }`
        result[name] = (result[name] ?? 0) + 1
      }
      return result
    }, {} as Record<string, number>)
    return stealData
  }

  async getTopTeam() {
    return await this.prisma.camper.groupBy({
      by: ['teamId'],
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

  async getTeamName(teamId: string) {
    return (
      await this.prisma.team.findUnique({
        select: { name: true },
        where: { id: teamId },
      })
    ).name
  }

  async getStealCount(uid: string): Promise<number> {
    const data = await this.prisma.coinUpdate.findMany({
      select: { amount: true, metadata: true },
      where: { camperId: uid },
    })
    const stealCount = data.reduce((sum, coinUpdate) => {
      const metadata = coinUpdate.metadata as unknown as CoinUpdateMeta
      if (metadata.type === 'steal' || metadata.type === 'give-steal-penalty') return sum + 1
      return sum
    }, 0)
    return stealCount
  }
}
