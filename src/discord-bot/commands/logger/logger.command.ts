import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { PrismaService } from 'src/prisma.service'

@Command({
  name: 'logger',
  description: 'Assign logger to channel',
})
@Injectable()
export class LoggerCommand implements DiscordCommand {
  private readonly logger = new Logger(LoggerCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${LoggerCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    // const camperInfo = await this.prisma.camper.findFirst({
    //   select: { coins: true },
    //   where: {
    //     discordAccounts: {
    //       some: { discordId: interaction.user.id },
    //     },
    //   },
    // })

    // if (!camperInfo) {
    //   this.logger.error(`User ${interaction.user.id} is not registered`)
    //   return { content: 'หาข้อมูลของคุณไม่พบ' }
    // }

    // try {
    //   return {
    //     content: `แต้มบุญคงเหลือของคุณอยู่ที่ ${camperInfo.coins} แต้มบุญ`,
    //   }
    // } catch (err) {
    //   this.logger.error(err)
    //   return { content: 'มีบางอย่างผิดพลาด' }
    // }

    return {
      content: 'logger',
    }
  }
}
