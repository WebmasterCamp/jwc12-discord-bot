import { Injectable } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { CommandInteraction } from 'discord.js'

@Command({
  name: 'ping',
  description: 'Test the bot connection!',
})
@Injectable()
export class PingCommand implements DiscordCommand {
  handler(interaction: CommandInteraction): string {
    return `Pong ${interaction.user.username}!`
  }
}