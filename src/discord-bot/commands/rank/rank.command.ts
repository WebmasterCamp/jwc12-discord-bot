import { Command } from '@discord-nestjs/core'

import { RankBranchSubCommand } from './rank-branch.command'
import { RankIndividualSubCommand } from './rank-individual.command'
import { RankStealSubCommand } from './rank-steal.command'
import { RankStolenSubCommand } from './rank-stolen-command'
import { RankTeamSubCommand } from './rank-team.command'

@Command({
  name: 'rank',
  description: 'ดูอันดับแต้มบุญ',
  include: [
    RankIndividualSubCommand,
    RankBranchSubCommand,
    RankStealSubCommand,
    RankStolenSubCommand,
    RankTeamSubCommand,
  ],
})
export class RankCommand {}
