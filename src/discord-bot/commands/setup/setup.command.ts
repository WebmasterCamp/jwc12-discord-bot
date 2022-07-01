import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand, UseFilters } from '@discord-nestjs/core'
import { CommandInteraction } from 'discord.js'
import { GuildService } from 'src/guild/guild.service'

import { CommandErrorFilter } from '../error-filter'

@Command({
  name: 'setup',
  description: 'Setup guild for bot',
})
@Injectable()
@UseFilters(CommandErrorFilter)
export class SetupCommand implements DiscordCommand {
  private readonly logger = new Logger(SetupCommand.name)

  constructor(private guildService: GuildService) {
    this.logger.log(`${SetupCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction) {
    this.guildService.setup(interaction.guild)
    return {
      content: `Setup complete`,
      ephemeral: true,
    }
  }
}
