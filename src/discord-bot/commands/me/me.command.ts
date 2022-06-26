import { Injectable, Logger, UseFilters } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import {
  CommandInteraction,
  EmbedFieldData,
  InteractionReplyOptions,
  MessageEmbed,
} from 'discord.js'

import { PrismaService } from '@app/prisma.service'

@Command({
  name: 'me',
  description: 'Retrieve User information',
})
@Injectable()
export class MeCommand implements DiscordCommand {
  private readonly logger = new Logger(MeCommand.name)

  constructor(private prisma: PrismaService) {}

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    const camperInfo = await this.prisma.camper.findUnique({
      include: { Team: true },
      where: { discordId: interaction.user.id },
    })

    if (!camperInfo) {
      this.logger.error(`User ${interaction.user.id} is not registered`)
      return { content: 'หาข้อมูลของคุณไม่พบ' }
    }

    try {
      const fileds: EmbedFieldData[] | EmbedFieldData[][] = [
        { name: 'ชื่อจริง', value: camperInfo.firstName, inline: true },
        { name: 'นามกสุล', value: camperInfo.lastName, inline: true },
        { name: 'ชื่อเล่น', value: camperInfo.nickname, inline: true },
        { name: 'รหัส', value: camperInfo.camperId, inline: true },
        { name: 'เบอร์โทรศัพท์', value: camperInfo.telephone, inline: true },
        { name: 'คะแนน', value: camperInfo.points.toString(), inline: true },
        camperInfo.Team && { name: 'ทีม', value: camperInfo.Team.name, inline: true },
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
      }
    } catch (err) {
      this.logger.error(err)
      return { content: 'มีบางอย่างผิดพลาด' }
    }
  }
}
