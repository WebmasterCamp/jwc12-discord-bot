import { DiscordCommand, SubCommand, UseFilters } from '@discord-nestjs/core'
import { CommandInteraction } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'

import { CommandErrorFilter } from '../error-filter'

@SubCommand({ name: 'stolen', description: 'ดูอันดับนักถูกปล้น' })
@UseFilters(CommandErrorFilter)
export class RankStolenSubCommand implements DiscordCommand {
  constructor(private campers: CamperRepository) {}

  async handler(interaction: CommandInteraction) {
    const stealData = await this.campers.getTopStolen()

    const records = Object.entries(stealData)
      .sort((dataA, dataB) => dataB[1] - dataA[1])
      .slice(0, 7)

    await interaction.reply({
      content: `อันดับนักถูกปล้นรายบุคคล\n${records
        .map((data, index) => {
          return `${index + 1}. ${data[0]} - ถูกปล้น ${data[1]} ครั้ง`
        })
        .join('\n')}`,
    })
  }
}
