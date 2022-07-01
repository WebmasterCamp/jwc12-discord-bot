import { DiscordCommand, SubCommand, UseFilters } from '@discord-nestjs/core'
import { CommandInteraction } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'
import { branchAbbreviations } from 'src/discord-bot/utils/constants'

import { CommandErrorFilter } from '../error-filter'

@SubCommand({ name: 'individual', description: 'ดูอันดับแต้มบุญรายบุคคล' })
@UseFilters(CommandErrorFilter)
export class RankIndividualSubCommand implements DiscordCommand {
  constructor(private campers: CamperRepository) {}

  async handler(interaction: CommandInteraction) {
    const ranks = await this.campers.getTopCoinsIndividual()

    await interaction.reply({
      content: `อันดับแต้มบุญรายบุคคล\n${ranks
        .map((rank, index) => {
          const nameAndBranch = `[${branchAbbreviations[rank.branch]}] ${rank.nickname}`
          return `${index + 1}. ${nameAndBranch} - ${rank.coins} แต้ม`
        })
        .join('\n')}`,
    })
  }
}
