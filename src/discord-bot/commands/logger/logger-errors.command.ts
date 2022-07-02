import { Injectable, Logger } from '@nestjs/common'

import { TransformPipe } from '@discord-nestjs/common'
import {
  DiscordTransformedCommand,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UseFilters,
  UsePipes,
} from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'
import { parseMention } from 'src/discord-bot/utils/mention'
import { GuildService } from 'src/guild/guild.service'

import { CommandErrorFilter } from '../error-filter'
import { LoggerDto } from './logger.dto'

@SubCommand({
  name: 'errors',
  description: 'Log errors',
})
@Injectable()
@UsePipes(TransformPipe)
@UseFilters(CommandErrorFilter)
export class LoggerErrorsSubCommand implements DiscordTransformedCommand<LoggerDto> {
  private readonly logger = new Logger(LoggerErrorsSubCommand.name)

  constructor(private guildService: GuildService) {
    this.logger.log(`${LoggerErrorsSubCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: LoggerDto,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    const channelMention = parseMention(dto.channel)
    if (!channelMention || channelMention.type !== 'channel') {
      return {
        content: `โปรดระบุ channel`,
        ephemeral: true,
      }
    }
    await this.guildService.setErrorChannel(interaction.guildId, channelMention.channelId)
    return {
      content: `ตั้งค่าการแจ้งเตือน errors ไปที่ ${channelMention.formatted}`,
    }
  }
}
