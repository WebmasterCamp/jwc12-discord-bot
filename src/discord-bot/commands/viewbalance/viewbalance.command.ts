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

import { CommandErrorFilter } from '../error-filter'
import { ViewBalanceDTO } from './viewbalance.dto'

@Command({
  name: 'viewbalance',
  description: 'ดูแต้มบุญของน้อง',
})
@Injectable()
@UsePipes(TransformPipe)
@UseFilters(CommandErrorFilter)
export class ViewBalanceCommand implements DiscordTransformedCommand<ViewBalanceDTO> {
  private readonly logger = new Logger(ViewBalanceCommand.name)

  constructor(private campers: CamperRepository) {
    this.logger.log(`${ViewBalanceCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: ViewBalanceDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    const target = await mentionFromId(interaction.guild, dto.target)
    if (target === null || !['user', 'role'].includes(target.type)) {
      return {
        content: `โปรดระบุผู้ใช้หรือ role ที่ต้องการดูแต้มบุญ`,
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

    const totalAmount = `${await this.campers.getCoinsByIds(ids)}`

    if (target.type === 'role') {
      return {
        content: `${target.formatted} มีแต้มบุญรวม ${Formatters.bold(totalAmount)} แต้มบุญ`,
        ephemeral: true,
      }
    } else {
      return {
        content: `${target.formatted} มีแต้มบุญ ${Formatters.bold(totalAmount)} แต้มบุญ`,
        ephemeral: true,
      }
    }
  }

  private async getCamperIds(mention: Mention, guild: Guild): Promise<string[] | null> {
    switch (mention.type) {
      case 'user':
        const camperId = await this.campers.getIdByDiscordId(mention.userId)
        return camperId ? [camperId] : null
      case 'role':
        const role = await guild.roles.fetch(mention.roleId)
        if (!role) return null
        const memberIds = role.members.map((member) => member.id)
        return await this.campers.getIdsByDiscordIds(memberIds)
      default:
        return null
    }
  }
}
