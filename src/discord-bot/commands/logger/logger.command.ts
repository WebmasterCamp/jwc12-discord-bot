import { Injectable, Logger } from '@nestjs/common'

import { TransformPipe } from '@discord-nestjs/common'
import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UseGuards,
  UsePipes,
} from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'
import { IsAdminInteractionGuard } from 'src/discord-bot/guard/is-admin.guard'
import { parseMention } from 'src/discord-bot/utils/mention'
import { GuildService } from 'src/guild/guild.service'

import { LoggerDto } from './logger.dto'

@Command({
  name: 'logger',
  description: 'Assign logger to channel',
})
@Injectable()
@UsePipes(TransformPipe)
@UseGuards(IsAdminInteractionGuard)
export class LoggerCommand implements DiscordTransformedCommand<LoggerDto> {
  private readonly logger = new Logger(LoggerCommand.name)

  constructor(private guildService: GuildService) {
    this.logger.log(`${LoggerCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: LoggerDto,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    try {
      const channelMention = parseMention(dto.channel)
      if (!channelMention || channelMention.type !== 'channel') {
        return {
          content: `โปรดระบุ channel`,
          ephemeral: true,
        }
      }
      await this.guildService.setLoggerChannel(interaction.guildId, dto.channel)
      return {
        content: `ตั้งค่าการแจ้งเตือนไปที่ ${channelMention.formatted}`,
        ephemeral: true,
      }
    } catch (err) {
      return {
        content: `มีข้อผิดพลาด ${err.message}`,
        ephemeral: true,
      }
    }
  }
}
