import { DiscordGuard, EventType } from '@discord-nestjs/core'
import { Message } from 'discord.js'

import { PrismaService } from '@app/prisma.service'

export class CamperGuard implements DiscordGuard {
  constructor(private readonly prisma: PrismaService) {}

  async canActive(event: EventType, [message]: [Message]): Promise<boolean> {
    const camperInfo = await this.prisma.camper.findUnique({
      where: { discordId: message.author.id },
    })

    return !camperInfo
  }
}
