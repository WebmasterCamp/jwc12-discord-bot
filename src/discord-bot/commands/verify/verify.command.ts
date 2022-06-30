import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand, On, UseGuards } from '@discord-nestjs/core'
import {
  CommandInteraction,
  InteractionReplyOptions,
  MessageActionRow,
  Modal,
  ModalActionRowComponent,
  ModalSubmitInteraction,
  TextInputComponent,
} from 'discord.js'
import { TextInputStyles } from 'discord.js/typings/enums'
import { IsModalInteractionGuard } from 'src/discord-bot/guard'
import { capitalize } from 'src/discord-bot/utils'
import { PrismaService } from 'src/prisma.service'

@Command({
  name: 'verify',
  description: 'Verify camper',
})
@Injectable()
export class VerifyCommand implements DiscordCommand {
  private readonly logger = new Logger(VerifyCommand.name)
  private readonly verifyModalId = 'Verify'
  private readonly verifyCodeComponentId = 'VerifyCode'

  constructor(private prisma: PrismaService) {
    this.logger.log(`${VerifyCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions | void> {
    const account = await this.prisma.discordAccount.findUnique({
      select: { discordId: true },
      where: {
        discordId: interaction.user.id,
      },
    })
    if (account) {
      this.logger.error(`User ${interaction.user.id} is already registered`)
      return { content: 'คุณได้ยืนยันตัวตนไปแล้ว', ephemeral: true }
    }
    const modal = new Modal().setTitle('ยืนยันตัวตน').setCustomId(this.verifyModalId)

    const verifyCodeInputComponent = new TextInputComponent()
      .setCustomId(this.verifyCodeComponentId)
      .setLabel('รหัสยืนยันตัวตน')
      .setStyle(TextInputStyles.SHORT)

    const rows = [verifyCodeInputComponent].map((component) =>
      new MessageActionRow<ModalActionRowComponent>().addComponents(component)
    )

    modal.addComponents(...rows)

    await interaction.showModal(modal)
  }

  @On('interactionCreate')
  @UseGuards(IsModalInteractionGuard)
  async onModuleSubmit(modal: ModalSubmitInteraction) {
    this.logger.log(`Modal ${modal.customId} submit`)

    if (modal.customId !== this.verifyModalId) return

    const verifyCode = modal.fields.getTextInputValue(this.verifyCodeComponentId)
    if (verifyCode.length !== 6) {
      await modal.reply({ content: 'รหัสยืนยันตัวตนไม่ถูกต้อง', ephemeral: true })
      return
    }

    const camper = await this.prisma.camper.findFirst({
      select: { id: true, nickname: true, branch: true },
      where: {
        firebaseId: {
          startsWith: verifyCode,
        },
      },
    })
    if (camper === null) {
      await modal.reply({ content: 'รหัสยืนยันตัวตนไม่ถูกต้อง', ephemeral: true })
      return
    }

    await this.prisma.camper.update({
      data: {
        discordAccounts: {
          create: {
            discordId: modal.user.id,
          },
        },
      },
      where: {
        id: camper.id,
      },
    })
    await modal.reply({
      content: `ยินดีต้อนรับ น้อง${camper.nickname} สาขา ${capitalize(camper.branch)}`,
      ephemeral: true,
    })
  }
}
