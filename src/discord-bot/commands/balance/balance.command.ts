import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand, UseFilters } from '@discord-nestjs/core'
import { CommandInteraction, Formatters, InteractionReplyOptions } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'
import { NotRegisteredError } from 'src/discord-bot/errors'

import { CommandErrorFilter } from '../error-filter'

@Command({
  name: 'balance',
  description: 'ตรวจสอบยอดบุญคงเหลือ',
})
@Injectable()
@UseFilters(CommandErrorFilter)
export class BalanceCommand implements DiscordCommand {
  private readonly logger = new Logger(BalanceCommand.name)

  constructor(private campers: CamperRepository) {
    this.logger.log(`${BalanceCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    const camperId = await this.campers.getIdByDiscordId(interaction.user.id)

    if (!camperId) {
      throw new NotRegisteredError()
    }

    const coins = await this.campers.getCoinsById(camperId)
    const userMention = Formatters.userMention(interaction.user.id)

    return {
      content: `${userMention} มีแต้มบุญคงเหลืออยู่ที่ ${coins} แต้ม`,
    }
  }
}
