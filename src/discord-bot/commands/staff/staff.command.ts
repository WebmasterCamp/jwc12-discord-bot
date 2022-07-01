import { Injectable, Logger } from '@nestjs/common'

import { TransformPipe } from '@discord-nestjs/common'
import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'
import { BotLogger } from 'src/discord-bot/logger/bot-logger'
import { parseMention } from 'src/discord-bot/utils/mention'
import { GuildService } from 'src/guild/guild.service'

import { StaffDTO } from './staff.dto'

@Command({
  name: 'staff',
  description: 'ให้ role staff',
})
@Injectable()
@UsePipes(TransformPipe)
export class StaffCommand implements DiscordTransformedCommand<StaffDTO> {
  private readonly logger = new Logger(StaffCommand.name)

  constructor(private guildService: GuildService, private botLogger: BotLogger) {
    this.logger.log(`${StaffCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: StaffDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    const userMention = parseMention(dto.user)
    if (!userMention || userMention.type !== 'user') {
      return {
        content: `โปรดระบุ user`,
        ephemeral: true,
      }
    }

    let debug = false
    debug = true
    try {
      if (debug) throw new Error('test')
      await this.guildService.assignRoleToId(interaction.guild, 'STAFF', userMention.userId)
      await interaction.guild.members.edit(userMention.userId, {
        nick: `${dto.nickname} ${dto.gen}`,
      })
      return {
        content: `ให้ role staff กับ ${userMention.formatted} แล้ว`,
        ephemeral: true,
      }
    } catch (err) {
      this.logger.error(err)
      await this.botLogger.logError(interaction, '/staff failed', err)
      return {
        content: 'มีบางอย่างผิดพลาด',
        ephemeral: true,
      }
    }
  }
}
