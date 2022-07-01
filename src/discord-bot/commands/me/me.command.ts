import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand, UseFilters } from '@discord-nestjs/core'
import {
  CommandInteraction,
  EmbedFieldData,
  InteractionReplyOptions,
  MessageEmbed,
} from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'
import { NotRegisteredError } from 'src/discord-bot/errors'

import { CommandErrorFilter } from '../error-filter'

@Command({
  name: 'me',
  description: 'Retrieve User information',
})
@Injectable()
@UseFilters(CommandErrorFilter)
export class MeCommand implements DiscordCommand {
  private readonly logger = new Logger(MeCommand.name)

  constructor(private campers: CamperRepository) {
    this.logger.log('MeCommand initialized')
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    const camperInfo = await this.campers.getByDiscordId(interaction.user.id)

    if (!camperInfo) {
      throw new NotRegisteredError()
    }

    const fileds: EmbedFieldData[] | EmbedFieldData[][] = [
      { name: 'ชื่อจริง', value: camperInfo.firstName, inline: true },
      { name: 'นามกสุล', value: camperInfo.lastName, inline: true },
      { name: 'ชื่อเล่น', value: camperInfo.nickname, inline: true },
      { name: 'รหัส', value: camperInfo.camperCode, inline: true },
      { name: 'เบอร์โทรศัพท์', value: camperInfo.telephone, inline: true },
      { name: 'คะแนน', value: camperInfo.coins.toString(), inline: true },
    ].filter((item) => !!item)

    const camperInfoEmbed = new MessageEmbed()
      .setTitle('รายละเอียดของคุณ')
      .setAuthor({
        name: `${camperInfo.firstName} ${camperInfo.lastName}`,
        iconURL: interaction.user.avatarURL(),
      })
      .addFields(fileds)
      .setTimestamp()

    return {
      embeds: [camperInfoEmbed],
      ephemeral: true,
    }
  }
}
