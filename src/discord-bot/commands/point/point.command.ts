import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { PrismaService } from 'src/prisma.service'

@Command({
  name: 'point',
  description: 'ตรวจสอบยอดบุญคงเหลือ',
})
@Injectable()
export class PointCommand implements DiscordCommand {
  private readonly logger = new Logger(PointCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${PointCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    const camperInfo = await this.prisma.camper.findUnique({
      select: { points: true },
      where: { discordId: interaction.user.id },
    })

    if (!camperInfo) {
      this.logger.error(`User ${interaction.user.id} is not registered`)
      return { content: 'หาข้อมูลของคุณไม่พบ' }
    }

    try {
      return {
        content: `คุณมีแต้มบุญอยู่ที่ ${camperInfo.points}`,
      }
    } catch (err) {
      this.logger.error(err)
      return { content: 'มีบางอย่างผิดพลาด' }
    }
  }
}
