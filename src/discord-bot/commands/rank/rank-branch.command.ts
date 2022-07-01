import { DiscordCommand, SubCommand, UseFilters } from '@discord-nestjs/core'
import { CommandInteraction } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'
import { capitalize } from 'src/discord-bot/utils/capitialize'

import { CommandErrorFilter } from '../error-filter'

@SubCommand({ name: 'branch', description: 'ดูอันดับแต้มบุญรายสาขา' })
@UseFilters(CommandErrorFilter)
export class RankBranchSubCommand implements DiscordCommand {
  constructor(private campers: CamperRepository) {}

  async handler(interaction: CommandInteraction) {
    const ranks = await this.campers.getTopCoinsBranch()

    await interaction.reply({
      content: `อันดับแต้มบุญรายสาขา\n${ranks
        .map((rank, index) => {
          return `${index + 1}. ${capitalize(rank.branch)} - ${rank._sum.coins} แต้ม`
        })
        .join('\n')}`,
    })
  }
}
