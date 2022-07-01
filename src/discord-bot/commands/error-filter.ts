import { Injectable } from '@nestjs/common'

import { Catch, DiscordArgumentMetadata, DiscordExceptionFilter } from '@discord-nestjs/core'
import { Formatters } from 'discord.js'

import { BotLogger } from '../logger/bot-logger'
import { formatCommandOptions } from '../utils/format-command-options'

@Injectable()
@Catch(Error)
export class CommandErrorFilter implements DiscordExceptionFilter {
  constructor(private botLogger: BotLogger) {}

  async catch(error: Error, metadata: DiscordArgumentMetadata<'interactionCreate'>): Promise<void> {
    const [interaction] = metadata.eventArgs

    if (!interaction.isCommand()) return
    const logMessage = `
${Formatters.bold('Command Error')}
${Formatters.userMention(interaction.user.id)} used ${Formatters.bold(
      `/${interaction.commandName}`
    )} ${formatCommandOptions(interaction.command, interaction.options)}
${Formatters.codeBlock(error.stack)}
    `
    await this.botLogger.log(interaction, logMessage)
    await interaction.reply({ content: 'มีบางอย่างผิดพลาด โปรดติดต่อแอดมิน', ephemeral: true })
  }
}
