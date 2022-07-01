import { Injectable } from '@nestjs/common'

import { Formatters, Guild, Interaction, TextChannel } from 'discord.js'
import { GuildService } from 'src/guild/guild.service'

@Injectable()
export class BotLogger {
  constructor(private guildService: GuildService) {}

  async log(interaction: Interaction, message: string): Promise<void> {
    const loggingChannel = await this.getLoggingChannel(interaction.guild)
    await loggingChannel.send(message)
  }

  async logError(interaction: Interaction, error: Error) {
    const loggingChannel = await this.getLoggingChannel(interaction.guild)
    await loggingChannel.send(`Error: ${error.message}\n${Formatters.codeBlock(error.stack)}`)
  }

  private async getLoggingChannel(guild: Guild): Promise<TextChannel | null> {
    const metadata = await this.guildService.getGuildMetadata(guild.id)
    if (!metadata.loggingChannel) return null

    const loggingChannel = guild.channels.cache.get(metadata.loggingChannel) as TextChannel
    return loggingChannel
  }
}
