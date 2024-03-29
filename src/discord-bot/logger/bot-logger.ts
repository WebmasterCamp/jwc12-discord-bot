import { Injectable } from '@nestjs/common'

import {
  CommandInteraction,
  ContextMenuInteraction,
  Formatters,
  Guild,
  Interaction,
  MessageActionRow,
  MessageButton,
  TextChannel,
} from 'discord.js'
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

  async logError(
    interaction: Interaction,
    message: string,
    error: Error,
    components?: MessageActionRow[]
  ) {
    const errorChannel =
      (await this.getErrorChannel(interaction.guild)) ??
      (await this.getLoggingChannel(interaction.guild))
    await errorChannel.send({
      content: dedent`
        ${message}
        ${Formatters.codeBlock(error.stack)}
      `,
      components,
    })
  }

  private async getLoggingChannel(guild: Guild): Promise<TextChannel | null> {
    const metadata = await this.guildService.getGuildMetadata(guild.id)
    if (!metadata.loggingChannel) return null

    const loggingChannel = guild.channels.cache.get(metadata.loggingChannel) as TextChannel
    return loggingChannel
  }

  private async getErrorChannel(guild: Guild): Promise<TextChannel | null> {
    const metadata = await this.guildService.getGuildMetadata(guild.id)
    if (!metadata.errorChannel) return null

    const errorChannel = guild.channels.cache.get(metadata.errorChannel) as TextChannel
    return errorChannel
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

  async logContextMenuError(interaction: ContextMenuInteraction, error: Error) {
    const components = []
    const userMention = Formatters.userMention(interaction.user.id)
    let targetMention: string
    if (interaction.isMessageContextMenu()) {
      const messageId = interaction.targetMessage.id
      const messageLink = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${messageId}`
      targetMention = `on message ${Formatters.inlineCode(messageId)}`

      const linkButton = new MessageButton()
        .setStyle('LINK')
        .setLabel('Go to message')
        .setURL(messageLink)

      const row = new MessageActionRow().addComponents(linkButton)
      components.push(row)
    } else if (interaction.isUserContextMenu()) {
      targetMention = `on ${Formatters.userMention(interaction.targetUser.id)}`
    }
    const commandName = Formatters.bold(interaction.commandName)
    const executionInfo = `${userMention} used ${commandName} ${targetMention}`
    await this.logError(
      interaction,
      dedent`
        ${Formatters.bold('Context Menu Error')}
        ${executionInfo}
      `,
      error,
      components
    )
    await interaction.reply({ content: 'มีบางอย่างผิดพลาด โปรดติดต่อแอดมิน', ephemeral: true })
  }
}
