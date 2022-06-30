import { Injectable, Logger } from '@nestjs/common'

import { TransformPipe } from '@discord-nestjs/common'
import {
  DiscordTransformedCommand,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UseGuards,
  UsePipes,
} from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'
import { IsGiverInteractionGuard } from 'src/discord-bot/guard/is-giver.guard'
import { PrismaService } from 'src/prisma.service'

import { GiveCamperDTO } from './give.dto'

@SubCommand({
  name: 'user',
  description: 'ให้แต้่มบุญกับน้องที่ระบุ',
})
@Injectable()
@UsePipes(TransformPipe)
@UseGuards(IsGiverInteractionGuard)
export class GiveCamperSubCommand implements DiscordTransformedCommand<GiveCamperDTO> {
  private readonly logger = new Logger(GiveCamperSubCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${GiveCamperSubCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: GiveCamperDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    try {
      const amountInt = parseInt(dto.amount)
      const camper = await this.prisma.discordAccount.findFirst({
        select: {
          discordId: true,
          Camper: { select: { id: true, coins: true } },
        },
        where: { discordId: dto.user },
      })

      const newCoins = camper.Camper.coins + amountInt

      await this.prisma.camper.update({
        where: { id: camper.Camper.id },
        data: { coins: newCoins > 0 ? newCoins : 0 },
      })

      return {
        content: `<@${interaction.user.id}> แจกแต้มบุญให้น้อง <@${dto.user}> เป็นมูลค่า ${dto.amount} แต้มบุญ`,
      }
    } catch (err) {
      this.logger.error(err)
      return {
        content: 'มีบางอย่างผิดพลาด',
      }
    }
  }
}
