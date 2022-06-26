import { Injectable } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { CommandInteraction } from 'discord.js'

@Command({
  name: 'register',
  description: 'Register a camper to the discord',
})
@Injectable()
export class RegisterCommand implements DiscordCommand {
  handler(interaction: CommandInteraction): string {
    return `Pong ${interaction.user.username}!`
  }
}
