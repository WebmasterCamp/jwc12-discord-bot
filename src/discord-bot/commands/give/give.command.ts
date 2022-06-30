import { Injectable } from '@nestjs/common'

import { Command } from '@discord-nestjs/core'

import { GiveAllSubCommand } from './give-all.subcommand'
import { GiveUserSubCommand } from './give-user.subcommand'

@Command({
  name: 'give',
  description: 'ให้แต้่มบุญ',
  include: [GiveAllSubCommand, GiveUserSubCommand],
})
@Injectable()
export class GiveCommand {}
