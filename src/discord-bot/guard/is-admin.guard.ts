import { Inject, Logger } from '@nestjs/common'

import { DiscordGuard, EventArgs } from '@discord-nestjs/core'
import { ClientEvents } from 'discord.js'
import { PrismaService } from 'src/prisma.service'

export class IsAdminInteractionGuard implements DiscordGuard {
  private readonly logger = new Logger(IsAdminInteractionGuard.name)
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async canActive(
    event: keyof ClientEvents,
    [interaction]: EventArgs<'interactionCreate'>
  ): Promise<boolean> {
    if (interaction.user.id === interaction.guild.ownerId) return true

    const metadata = await this.prisma.guildMetadata.findUnique({
      select: { adminRole: true },
      where: { guildId: interaction.guild.id },
    })

    if (!metadata) {
      this.logger.error("Guild doesn't have metadata. Please set it up by using /role")
      return false
    }

    return event === 'interactionCreate' && !!metadata?.adminRole
  }
}
