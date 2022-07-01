import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { CommandInteraction } from 'discord.js'
import { GuildService } from 'src/guild/guild.service'

@Command({
  name: 'setup',
  description: 'Setup guild for bot',
})
@Injectable()
export class SetupCommand implements DiscordCommand {
  private readonly logger = new Logger(SetupCommand.name)

  constructor(private guildService: GuildService) {
    this.logger.log(`${SetupCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction) {
    try {
      this.guildService.setup(interaction.guild)
      return {
        content: `Setup complete`,
        ephemeral: true,
      }
    } catch (err) {
      this.logger.error(err)
      return { content: 'มีบางอย่างผิดพลาด', ephemeral: true }
    }
  }
}
