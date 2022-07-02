import { Command } from '@discord-nestjs/core'

import { LoggerErrorsSubCommand } from './logger-errors.command'
import { LoggerEventsSubCommand } from './logger-events.command'

@Command({
  name: 'logger',
  description: 'Assign logger to channel',
  include: [LoggerEventsSubCommand, LoggerErrorsSubCommand],
})
export class LoggerCommand {}
