import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { CommandInteraction, Formatters, InteractionReplyOptions } from 'discord.js'
import { PrismaService } from 'src/prisma/prisma.service'

@Command({
  name: 'ping',
  description: 'Test the bot connection!',
})
@Injectable()
export class PingCommand implements DiscordCommand {
  private readonly logger = new Logger(PingCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${PingCommand.name} initialized`)
  }

  handler(interaction: CommandInteraction): InteractionReplyOptions {
    return { content: `Pong ${Formatters.userMention(interaction.user.id)}!`, ephemeral: true }
  }
}
