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

  constructor(private guildService: GuildService) {
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

    try {
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
      return {
        content: 'มีบางอย่างผิดพลาด',
        ephemeral: true,
      }
    }
  }
}
