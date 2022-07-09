import { DiscordCommand, SubCommand, UseFilters } from '@discord-nestjs/core'
import { CommandInteraction } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'

import { CommandErrorFilter } from '../error-filter'

const fullTeamName = {
  A: 'The Magician',
  B: 'The High Priestess',
  C: 'The Empress',
  D: 'The Emperor',
  E: 'The Hierophant',
  F: 'The Lovers',
}

type FullTeamName = keyof typeof fullTeamName

@SubCommand({ name: 'team', description: 'ดูอันดับตามบ้าน' })
@UseFilters(CommandErrorFilter)
export class RankTeamSubCommand implements DiscordCommand {
  constructor(private campers: CamperRepository) {}

  async handler(interaction: CommandInteraction) {
    const topTeams = await this.campers.getTopTeam()

    const topTeamsWithName = await Promise.all(
      topTeams
        .filter(({ teamId }) => !!teamId)
        .map(async ({ teamId, _sum }) => ({
          teamId,
          coins: _sum.coins,
          name: await this.campers.getTeamName(teamId),
        }))
    )

    await interaction.reply({
      content: `อันดับแต้มบุญรายบ้าน\n${topTeamsWithName
        .map((data, index) => {
          return `${index + 1}. (${data.name}) ${fullTeamName[data.name as FullTeamName]} - ${
            data.coins
          } แต้ม`
        })
        .join('\n')}`,
    })

    return ''
  }
}
