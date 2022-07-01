import { Injectable, Logger } from '@nestjs/common'

import { TransformPipe } from '@discord-nestjs/common'
import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core'
import { Guild, InteractionReplyOptions } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'
import { Mention, parseMention } from 'src/discord-bot/utils/mention'

import { GiveDTO } from './give.dto'

@Command({
  name: 'give',
  description: 'ให้แต้มบุญ',
})
@Injectable()
@UsePipes(TransformPipe)
export class GiveCommand implements DiscordTransformedCommand<GiveDTO> {
  private readonly logger = new Logger(GiveCommand.name)

  constructor(private campers: CamperRepository) {
    this.logger.log(`${GiveCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: GiveDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    try {
      const target = parseMention(dto.target)
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
      const amount = parseInt(dto.amount)
      await this.campers.incrementCoinByIds(ids, amount)

      if (target.type === 'role') {
        return {
          content: `${dto.target} รับไปเลยคนละ ${amount} แต้มบุญ❗️ โดยพี่ <@${interaction.user.id}>`,
        }
      } else {
        return {
          content: `<@${interaction.user.id}> แจกแต้มบุญให้น้อง ${dto.target} เป็นมูลค่า ${amount} แต้มบุญ`,
        }
      }
    } catch (err) {
      this.logger.error(err)
      return {
        content: 'มีบางอย่างผิดพลาด',
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
