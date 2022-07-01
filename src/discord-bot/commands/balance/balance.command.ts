import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'

@Command({
  name: 'balance',
  description: 'ตรวจสอบยอดบุญคงเหลือ',
})
@Injectable()
export class BalanceCommand implements DiscordCommand {
  private readonly logger = new Logger(BalanceCommand.name)

  constructor(private campers: CamperRepository) {
    this.logger.log(`${BalanceCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    const camperId = await this.campers.getIdByDiscordId(interaction.user.id)

    if (!camperId) {
      this.logger.error(`User ${interaction.user.id} is not registered`)
      return { content: 'หาข้อมูลของคุณไม่พบ', ephemeral: true }
    }

    const coins = await this.campers.getCoinsById(camperId)

    try {
      return {
        content: `แต้มบุญคงเหลือของคุณอยู่ที่ ${coins} แต้มบุญ`,
        ephemeral: true,
      }
    } catch (err) {
      this.logger.error(err)
      return { content: 'มีบางอย่างผิดพลาด', ephemeral: true }
    }
  }
}
