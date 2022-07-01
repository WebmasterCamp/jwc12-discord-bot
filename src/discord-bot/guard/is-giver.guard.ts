import { Inject, Logger } from '@nestjs/common'

import { DiscordGuard, EventArgs } from '@discord-nestjs/core'
import { ClientEvents } from 'discord.js'
import { PrismaService } from 'src/prisma/prisma.service'

export class IsGiverInteractionGuard implements DiscordGuard {
  private readonly logger = new Logger(IsGiverInteractionGuard.name)
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async canActive(
    event: keyof ClientEvents,
    [interaction]: EventArgs<'interactionCreate'>
  ): Promise<boolean> {
    const metadata = await this.prisma.guildMetadata.findUnique({
      select: { giverRole: true, adminRole: true },
      where: { guildId: interaction.guildId },
    })

    if (!metadata) {
      this.logger.error("Guild doesn't have metadata or giverRole. Please set it up by using /role")
      return false
    }

    if (!metadata?.giverRole && !metadata?.adminRole) {
      this.logger.error(
        'Guild metadata does not have giverRole or adminRole. Please set it up by using /role'
      )
      return false
    }

    return event === 'interactionCreate'
  }
}
