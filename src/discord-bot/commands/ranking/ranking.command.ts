import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand, UseFilters } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { PrismaService } from 'src/prisma/prisma.service'

import { CommandErrorFilter } from '../error-filter'

@Command({
  name: 'ranking',
  description: 'Ranking',
})
@Injectable()
@UseFilters(CommandErrorFilter)
export class RankingCommand implements DiscordCommand {
  private readonly logger = new Logger(RankingCommand.name)

  constructor(private prisma: PrismaService) {}

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    return {}
  }
}
