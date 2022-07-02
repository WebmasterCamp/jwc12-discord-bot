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
import { Formatters, InteractionReplyOptions } from 'discord.js'
import { BotLogger } from 'src/discord-bot/logger/bot-logger'
import { GuildService } from 'src/guild/guild.service'

import { CommandErrorFilter } from '../error-filter'
import { StaffDTO } from './staff.dto'

@Command({
  name: 'staff',
  description: 'ให้ role staff',
})
@Injectable()
@UsePipes(TransformPipe)
@UseFilters(CommandErrorFilter)
export class StaffCommand implements DiscordTransformedCommand<StaffDTO> {
  private readonly logger = new Logger(StaffCommand.name)

  constructor(private guildService: GuildService, private botLogger: BotLogger) {
    this.logger.log(`${StaffCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: StaffDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    await this.guildService.assignRoleToId(interaction.guild, 'STAFF', dto.user)
    await interaction.guild.members.edit(dto.user, {
      nick: `Staff - ${dto.nickname}`,
    })
    return {
      content: `ให้ role staff กับ ${Formatters.userMention(dto.user)} แล้ว`,
    }
  }
}
