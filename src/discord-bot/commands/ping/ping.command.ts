import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand, UseFilters } from '@discord-nestjs/core'
import { CommandInteraction, Formatters, InteractionReplyOptions } from 'discord.js'
import { PrismaService } from 'src/prisma/prisma.service'

import { CommandErrorFilter } from '../error-filter'

@Command({
  name: 'ping',
  description: 'Test the bot connection!',
})
@Injectable()
@UseFilters(CommandErrorFilter)
export class PingCommand implements DiscordCommand {
  private readonly logger = new Logger(PingCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${PingCommand.name} initialized`)
  }

  handler(interaction: CommandInteraction): InteractionReplyOptions {
    return { content: `Pong ${Formatters.userMention(interaction.user.id)}!`, ephemeral: true }
  }
}
