import { Injectable } from '@nestjs/common'

import { CommandInteraction, Formatters, Guild, Interaction, TextChannel } from 'discord.js'
import { GuildService } from 'src/guild/guild.service'
import dedent from 'ts-dedent'

import { NotRegisteredError } from '../errors'
import { formatCommandOptions } from '../utils/format-command-options'

@Injectable()
export class BotLogger {
  constructor(private guildService: GuildService) {}

  async log(interaction: Interaction, message: string): Promise<void> {
    const loggingChannel = await this.getLoggingChannel(interaction.guild)
    await loggingChannel.send(message)
  }

  async logError(interaction: Interaction, message: string, error: Error) {
    await this.log(
      interaction,
      dedent`
        ${message}
        ${Formatters.codeBlock(error.stack)}
      `
    )
  }

  private async getLoggingChannel(guild: Guild): Promise<TextChannel | null> {
    const metadata = await this.guildService.getGuildMetadata(guild.id)
    if (!metadata.loggingChannel) return null

    const loggingChannel = guild.channels.cache.get(metadata.loggingChannel) as TextChannel
    return loggingChannel
  }

  async logCommandError(interaction: CommandInteraction, error: Error) {
    const executionInfo = `${Formatters.userMention(interaction.user.id)} used ${Formatters.bold(
      `/${interaction.commandName}`
    )} ${formatCommandOptions(interaction.command, interaction.options)}`

    if (error instanceof NotRegisteredError) {
      await this.log(
        interaction,
        dedent`
          ${Formatters.bold('Execute without verify')}
          ${executionInfo}
        `
      )
      await interaction.reply({ content: 'โปรดยืนยันตัวตนก่อนใช้คำสั่งนี้', ephemeral: true })
      return
    }

    await this.logError(
      interaction,
      dedent`
        ${Formatters.bold('Command Error')}
        ${executionInfo}
      `,
      error
    )
    await interaction.reply({ content: 'มีบางอย่างผิดพลาด โปรดติดต่อแอดมิน', ephemeral: true })
  }
}
