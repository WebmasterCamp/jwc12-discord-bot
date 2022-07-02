import { Injectable, Logger } from '@nestjs/common'

import { Catch, DiscordArgumentMetadata, DiscordExceptionFilter } from '@discord-nestjs/core'
import dedent from 'ts-dedent'

import { BotLogger } from '../logger/bot-logger'

@Injectable()
@Catch()
export class CommandErrorFilter implements DiscordExceptionFilter {
  private readonly logger = new Logger(CommandErrorFilter.name)

  constructor(private botLogger: BotLogger) {}

  async catch(error: Error, metadata: DiscordArgumentMetadata<'interactionCreate'>): Promise<void> {
    try {
      const [interaction] = metadata.eventArgs

      if (interaction.isCommand()) {
        await this.botLogger.logCommandError(interaction, error)
      } else if (interaction.isContextMenu()) {
        await this.botLogger.logContextMenuError(interaction, error)
      }
    } catch (e) {
      if (e instanceof Error) {
        e = e.stack
      }
      this.logger.error(dedent`
        Error filter failed. I don't know what to do, but here's the error: 
        ${e}
      `)
    }
  }
}
