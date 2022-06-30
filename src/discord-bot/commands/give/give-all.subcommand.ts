import { Injectable, Logger } from '@nestjs/common'

import { DiscordCommand, SubCommand, UseGuards } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { IsGiverInteractionGuard } from 'src/discord-bot/guard/is-giver.guard'
import { PrismaService } from 'src/prisma.service'

@SubCommand({
  name: 'all',
  description: 'ให้แต้่มบุญกับน้องทุกคน',
})
@Injectable()
@UseGuards(IsGiverInteractionGuard)
export class GiveAllSubCommand implements DiscordCommand {
  private readonly logger = new Logger(GiveAllSubCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${GiveAllSubCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    return {}
  }
}
