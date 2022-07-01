import { Command } from '@discord-nestjs/core'

import { RankBranchSubCommand } from './rank-branch.command'
import { RankIndividualSubCommand } from './rank-individual.command'

@Command({
  name: 'rank',
  description: 'ดูอันดับแต้มบุญ',
  include: [RankIndividualSubCommand, RankBranchSubCommand],
})
export class RankCommand {}
