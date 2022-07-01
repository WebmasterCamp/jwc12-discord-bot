import { Injectable } from '@nestjs/common'

import { Catch, DiscordArgumentMetadata, DiscordExceptionFilter } from '@discord-nestjs/core'
import { Formatters } from 'discord.js'
import dedent from 'ts-dedent'

import { NotRegisteredError } from '../errors'
import { BotLogger } from '../logger/bot-logger'
import { formatCommandOptions } from '../utils/format-command-options'

@Injectable()
@Catch()
export class CommandErrorFilter implements DiscordExceptionFilter {
  constructor(private botLogger: BotLogger) {}

  async catch(error: Error, metadata: DiscordArgumentMetadata<'interactionCreate'>): Promise<void> {
    const [interaction] = metadata.eventArgs

    if (!interaction.isCommand()) return
    const executionInfo = `${Formatters.userMention(interaction.user.id)} used ${Formatters.bold(
      `/${interaction.commandName}`
    )} ${formatCommandOptions(interaction.command, interaction.options)}`

    if (error instanceof NotRegisteredError) {
      await this.botLogger.log(
        interaction,
        dedent`
          ${Formatters.bold('Execute without verify')}
          ${executionInfo}
        `
      )
      await interaction.reply({ content: 'โปรดยืนยันตัวตนก่อนใช้คำสั่งนี้', ephemeral: true })
      return
    }

    await this.botLogger.log(
      interaction,
      dedent`
        ${Formatters.bold('Command Error')}
        ${executionInfo}
        ${Formatters.codeBlock(error.stack)}
      `
    )
    await interaction.reply({ content: 'มีบางอย่างผิดพลาด โปรดติดต่อแอดมิน', ephemeral: true })
  }
}
