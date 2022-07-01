import { Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  async getGuildMetadata(guildId: string) {
    return await this.prisma.guildMetadata.upsert({
      where: { guildId: guildId },
      update: {},
      create: { guildId },
    })
  }

  async setLoggerChannel(guildId: string, channelId: string) {
    await this.prisma.guildMetadata.upsert({
      where: { guildId: guildId },
      update: { loggingChannel: channelId },
      create: { guildId: guildId, loggingChannel: channelId },
    })
  }
}
