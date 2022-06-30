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

import { GiveAllDTO } from './give.dto'

@SubCommand({
  name: 'all',
  description: 'ให้แต้่มบุญกับน้องทุกคน',
})
@Injectable()
@UsePipes(TransformPipe)
@UseGuards(IsGiverInteractionGuard)
export class GiveAllSubCommand implements DiscordTransformedCommand<GiveAllDTO> {
  private readonly logger = new Logger(GiveAllSubCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${GiveAllSubCommand.name} initialized`)
  }

  async handler(
    @Payload() { amount }: GiveAllDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    try {
      const amountInt = parseInt(amount)
      const campers = await this.prisma.camper.findMany()
      const newData = campers.map((c) => {
        const newAmount = c.coins + amountInt
        return {
          id: c.id,
          coins: newAmount > 0 ? newAmount : 0,
        }
      })
      await Promise.all(
        newData.map(async (data) => {
          await this.prisma.camper.update({
            where: { id: data.id },
            data: { coins: data.coins },
          })
          return null
        })
      )

      const metadata = await this.prisma.guildMetadata.findUnique({
        where: { guildId: interaction.guildId },
      })

      const mention = metadata?.camperRole ? `<@&${metadata.camperRole}>` : 'น้อง ๆ ทุกคน'
      return {
        content: `${mention} รับไปเลยคนละ ${amount} แต้มบุญ❗️ โดยพี่ <@${interaction.user.id}>`,
      }
    } catch (err) {
      this.logger.error(err)
      return {
        content: 'มีบางอย่างผิดพลาด',
      }
    }
  }
}
