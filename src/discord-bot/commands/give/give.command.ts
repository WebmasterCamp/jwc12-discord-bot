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
import { Guild, InteractionReplyOptions } from 'discord.js'
import { IsGiverInteractionGuard } from 'src/discord-bot/guard/is-giver.guard'
import { Mention, parseMention } from 'src/discord-bot/utils/mention'
import { PrismaService } from 'src/prisma/prisma.service'

import { GiveDTO } from './give.dto'

@Command({
  name: 'give',
  description: 'ให้แต้มบุญ',
})
@Injectable()
@UsePipes(TransformPipe)
@UseGuards(IsGiverInteractionGuard)
export class GiveCommand implements DiscordTransformedCommand<GiveDTO> {
  private readonly logger = new Logger(GiveCommand.name)

  constructor(private prisma: PrismaService) {
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
      await this.prisma.camper.updateMany({
        where: {
          id: {
            in: ids,
          },
        },
        data: {
          coins: {
            increment: amount,
          },
        },
      })

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
        const camper = await this.prisma.discordAccount.findUnique({
          select: { Camper: { select: { id: true } } },
          where: { discordId: mention.userId },
        })
        if (!camper) return null
        return [camper.Camper.id]
      case 'role':
        return this.getCamperIdsWithRole(mention.roleId, guild)
      default:
        return null
    }
  }

  private async getCamperIdsWithRole(roleId: string, guild: Guild): Promise<string[] | null> {
    const role = await guild.roles.fetch(roleId)
    if (!role) return null

    const memberIds = role.members.map((member) => member.id)
    const accounts = await this.prisma.discordAccount.findMany({
      select: { camperId: true },
      where: {
        discordId: {
          in: memberIds,
        },
      },
    })
    const campers = await this.prisma.camper.findMany({
      select: { id: true },
      where: {
        id: {
          in: accounts.map((account) => account.camperId),
        },
      },
    })
    return campers.map((camper) => camper.id)
  }
}
