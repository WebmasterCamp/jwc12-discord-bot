import { Injectable, Logger } from '@nestjs/common'

import { TransformPipe } from '@discord-nestjs/common'
import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UseFilters,
  UsePipes,
} from '@discord-nestjs/core'
import { Formatters, Guild, InteractionReplyOptions } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'
import { Mention, mentionFromId } from 'src/discord-bot/utils/mention'
import { GuildService } from 'src/guild/guild.service'

import { CommandErrorFilter } from '../error-filter'
import { DebugListDTO } from './debuglist.dto'

@Command({
  name: 'debuglist',
  description: 'debug role members',
})
@Injectable()
@UsePipes(TransformPipe)
@UseFilters(CommandErrorFilter)
export class DebugListCommand implements DiscordTransformedCommand<DebugListDTO> {
  private readonly logger = new Logger(DebugListCommand.name)

  constructor(private campers: CamperRepository, private guildService: GuildService) {
    this.logger.log(`${DebugListCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: DebugListDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    const target = await mentionFromId(interaction.guild, dto.target)
    if (target === null || target.type !== 'role') {
      return {
        content: `please specify debug role`,
        ephemeral: true,
      }
    }
    const memberIds = await this.guildService.getDiscordIdsByRole(interaction.guild, target.roleId)
    const mentions = memberIds.map((memberId) => Formatters.userMention(memberId))
    const message = `Users in role ${target.formatted}:\n${mentions.join(', ')}`
    return {
      content: message,
      ephemeral: true,
    }
  }
}
