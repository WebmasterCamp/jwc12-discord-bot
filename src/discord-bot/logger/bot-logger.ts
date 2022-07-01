import { Injectable } from '@nestjs/common'

import { Interaction, TextChannel } from 'discord.js'
import { GuildService } from 'src/guild/guild.service'

@Injectable()
export class BotLogger {
  constructor(private guildService: GuildService) {}

  async log(interaction: Interaction, message: string): Promise<void> {
    const metadata = await this.guildService.getGuildMetadata(interaction.guildId)

    if (!metadata?.loggingChannel) return

    const guild = await interaction.guild.fetch()
    const loggingChannel = guild.channels.cache.get(metadata.loggingChannel) as TextChannel
    await loggingChannel.send(message)
  }
}
