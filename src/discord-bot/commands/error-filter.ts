import { Injectable } from '@nestjs/common'

import { Catch, DiscordArgumentMetadata, DiscordExceptionFilter } from '@discord-nestjs/core'
import { Formatters } from 'discord.js'
import dedent from 'ts-dedent'

import { NotRegisteredError } from '../errors'
import { BotLogger } from '../logger/bot-logger'

@Injectable()
@Catch()
export class CommandErrorFilter implements DiscordExceptionFilter {
  constructor(private botLogger: BotLogger) {}

  async catch(error: Error, metadata: DiscordArgumentMetadata<'interactionCreate'>): Promise<void> {
    const [interaction] = metadata.eventArgs

    if (!interaction.isCommand()) return
    this.botLogger.logCommandError(interaction, error)
  }
}
