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
import { Guild, InteractionReplyOptions } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'
import { GrantCoinUpdateMeta } from 'src/camper/coin-update-meta'
import { Mention, mentionFromId } from 'src/discord-bot/utils/mention'
import { GuildService } from 'src/guild/guild.service'

import { CommandErrorFilter } from '../error-filter'
import { GrantDTO } from './grant.dto'

@Command({
  name: 'grant',
  description: 'เสกแต้มบุญให้น้อง',
})
@Injectable()
@UsePipes(TransformPipe)
@UseFilters(CommandErrorFilter)
export class GrantCommand implements DiscordTransformedCommand<GrantDTO> {
  private readonly logger = new Logger(GrantCommand.name)

  constructor(private campers: CamperRepository, private guildService: GuildService) {
    this.logger.log(`${GrantCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: GrantDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    const target = await mentionFromId(interaction.guild, dto.target)
    if (target === null || !['user', 'role'].includes(target.type)) {
      return {
        content: `โปรดระบุผู้ใช้หรือ role ที่ต้องการให้แต้มบุญ`,
        ephemeral: true,
      }
    }
    const ids = await this.getCamperIds(target, interaction.guild)
    if (!ids) {
      return {
        content: `ไม่พบผู้ใช้ที่ระบุ: ${dto.target}`,
        ephemeral: true,
      }
    }
    const amount = dto.amount
    let meta: GrantCoinUpdateMeta
    if (target.type === 'role') {
      meta = {
        type: 'grant',
        staffDiscordId: interaction.user.id,
        targetType: target.type,
        targetDiscordId: target.roleId,
      }
    } else if (target.type === 'user') {
      meta = {
        type: 'grant',
        staffDiscordId: interaction.user.id,
        targetType: target.type,
        targetDiscordId: target.userId,
      }
    }
    await this.campers.incrementCoinByIds(ids, amount, meta)

    if (target.type === 'role') {
      return {
        content: `${target.formatted} รับไปเลยคนละ ${amount} แต้มบุญ❗️`,
      }
    } else {
      return {
        content: `${target.formatted} ได้แต้มบุญเพิ่ม ${amount} แต้ม`,
      }
    }
  }

  private async getCamperIds(mention: Mention, guild: Guild): Promise<string[] | null> {
    switch (mention.type) {
      case 'user':
        const camperId = await this.campers.getIdByDiscordId(mention.userId)
        return camperId ? [camperId] : null
      case 'role':
        const memberIds = await this.guildService.getDiscordIdsByRole(guild, mention.roleId)
        return await this.campers.getIdsByDiscordIds(memberIds)
      default:
        return null
    }
  }
}
