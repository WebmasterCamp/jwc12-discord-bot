import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { PrismaService } from 'src/prisma.service'

@Command({
  name: 'verify',
  description: 'Verify camper',
})
@Injectable()
export class VerifyCommand implements DiscordCommand {
  private readonly logger = new Logger(VerifyCommand.name)

  constructor(private prisma: PrismaService) {}

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    return {}
  }
}
