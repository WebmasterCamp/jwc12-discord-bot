import { Injectable, Logger } from '@nestjs/common'

import { DiscordCommand, SubCommand } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { PrismaService } from 'src/prisma.service'

@SubCommand({
  name: 'user',
  description: 'เพิ่มลดแต้มบุญ',
})
@Injectable()
export class GiveUserSubCommand implements DiscordCommand {
  private readonly logger = new Logger(GiveUserSubCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${GiveUserSubCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    const camperInfo = await this.prisma.camper.findFirst({
      select: { coins: true },
      where: {
        discordAccounts: {
          some: { discordId: interaction.user.id },
        },
      },
    })

    if (!camperInfo) {
      this.logger.error(`User ${interaction.user.id} is not registered`)
      return { content: 'หาข้อมูลของคุณไม่พบ' }
    }

    try {
      return {
        content: `แต้มบุญคงเหลือของคุณอยู่ที่ ${camperInfo.coins} แต้มบุญ`,
      }
    } catch (err) {
      this.logger.error(err)
      return { content: 'มีบางอย่างผิดพลาด' }
    }
  }
}
