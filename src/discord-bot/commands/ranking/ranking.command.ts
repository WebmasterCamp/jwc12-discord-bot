import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { PrismaService } from 'src/prisma/prisma.service'

@Command({
  name: 'ranking',
  description: 'Ranking',
})
@Injectable()
export class RankingCommand implements DiscordCommand {
  private readonly logger = new Logger(RankingCommand.name)

  constructor(private prisma: PrismaService) {}

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    return {}
  }
}
