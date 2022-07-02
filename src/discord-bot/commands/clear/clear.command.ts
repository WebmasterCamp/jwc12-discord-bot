/* playlist.command.ts */
import { Command, DiscordCommand, UseFilters } from '@discord-nestjs/core'
import { Formatters, Message, MessageContextMenuInteraction } from 'discord.js'
import { ApplicationCommandTypes } from 'discord.js/typings/enums'
import { BotLogger } from 'src/discord-bot/logger/bot-logger'

import { CommandErrorFilter } from '../error-filter'

@Command({
  name: 'Clear After',
  type: ApplicationCommandTypes.MESSAGE,
})
@UseFilters(CommandErrorFilter)
export class ClearCommand implements DiscordCommand {
  constructor(private botLogger: BotLogger) {}

  async handler(interaction: MessageContextMenuInteraction) {
    let isFirstBatch = true
    let totalCount = 0
    while (true) {
      const batch = await interaction.channel.messages.fetch({
        after: interaction.targetMessage.id,
        limit: 100,
      })
      const values = [...batch.values()]
      if (isFirstBatch) {
        values.push(interaction.targetMessage as Message)
        isFirstBatch = false
      }
      if (values.length === 0) break
      await interaction.channel.bulkDelete(values)
      totalCount += values.length
    }
    await interaction.reply({
      content: `Cleared ${totalCount} messages`,
      ephemeral: true,
    })
    const userMention = Formatters.userMention(interaction.user.id)
    const channelMention = Formatters.channelMention(interaction.channelId)
    await this.botLogger.log(
      interaction,
      `${userMention} cleared ${totalCount} messages from ${channelMention}`
    )
  }
}
