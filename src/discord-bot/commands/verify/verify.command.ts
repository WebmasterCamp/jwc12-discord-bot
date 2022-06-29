import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import {
  CommandInteraction,
  InteractionReplyOptions,
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  TextInputComponent,
} from 'discord.js'
import { TextInputStyles } from 'discord.js/typings/enums'
import { PrismaService } from 'src/prisma.service'

@Command({
  name: 'verify',
  description: 'Verify camper',
})
@Injectable()
export class VerifyCommand implements DiscordCommand {
  private readonly logger = new Logger(VerifyCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${VerifyCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    const modal = new Modal().setTitle('Request participation').setCustomId('modal')

    const userNameInputComponent = new TextInputComponent()
      .setCustomId('username')
      .setLabel('Your username')
      .setStyle(TextInputStyles.SHORT)

    const commentInputComponent = new TextInputComponent()
      .setCustomId('input')
      .setLabel('Add an explanatory comment')
      .setStyle(TextInputStyles.PARAGRAPH)

    const rows = [userNameInputComponent, commentInputComponent].map((component) =>
      new MessageActionRow<ModalActionRowComponent>().addComponents(component)
    )

    modal.addComponents(...rows)

    await interaction.showModal(modal)

    // const camperInfo = await this.prisma.camper.findUnique({
    //   select: { points: true },
    //   where: { discordId: interaction.user.id },
    // })

    // if (!camperInfo) {
    //   this.logger.error(`User ${interaction.user.id} is not registered`)
    //   return { content: 'หาข้อมูลของคุณไม่พบ' }
    // }

    try {
      return {
        content: 'HAHAAAHAHHA',
      }
    } catch (err) {
      this.logger.error(err)
      return { content: 'มีบางอย่างผิดพลาด' }
    }
  }
}
