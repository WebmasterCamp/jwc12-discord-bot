import { Command, DiscordCommand } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { CommandInteraction } from 'discord.js';

@Command({
  name: 'ping',
  description: 'Pong!',
})
@Injectable()
export class PingCommand implements DiscordCommand {
  handler(interaction: CommandInteraction): string {
    return `Pong ${interaction.user.username}!`;
  }
}
