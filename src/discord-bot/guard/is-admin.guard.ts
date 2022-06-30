import { Logger } from '@nestjs/common'

import { DiscordGuard, EventArgs } from '@discord-nestjs/core'
import { ClientEvents } from 'discord.js'
import { PrismaService } from 'src/prisma.service'

export class IsAdminInteractionGuard implements DiscordGuard {
  private readonly logger = new Logger(IsAdminInteractionGuard.name)
  constructor(private readonly prisma: PrismaService) {}

  async canActive(
    event: keyof ClientEvents,
    [interaction]: EventArgs<'interactionCreate'>
  ): Promise<boolean> {
    const metadata = await this.prisma.guildMetadata.findFirst({
      select: { adminRole: true },
      where: { guildId: interaction.guild.id },
    })

    if (!metadata || !metadata.adminRole) {
      this.logger.error("Guild doesn't have metadata or adminRole. Please set it up by using /role")
      return false
    }

    return event === 'interactionCreate'
  }
}
