import { Injectable } from '@nestjs/common'

import { Command } from '@discord-nestjs/core'

import { GiveAllSubCommand } from './give-all.subcommand'
import { GiveCamperSubCommand } from './give-camper.subcommand'

@Command({
  name: 'give',
  description: 'ให้แต้่มบุญ',
  include: [GiveAllSubCommand, GiveCamperSubCommand],
})
@Injectable()
export class GiveCommand {}
