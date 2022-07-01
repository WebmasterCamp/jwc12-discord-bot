import { Injectable, Logger } from '@nestjs/common'

import { Command, DiscordCommand, On } from '@discord-nestjs/core'
import { BranchType } from '@prisma/client'
import {
  ButtonInteraction,
  CommandInteraction,
  Interaction,
  InteractionReplyOptions,
  MessageActionRow,
  MessageButton,
  Modal,
  ModalActionRowComponent,
  ModalSubmitInteraction,
  TextInputComponent,
} from 'discord.js'
import { TextInputStyles } from 'discord.js/typings/enums'
import { CamperRepository } from 'src/camper/camper.repository'
import { BotLogger } from 'src/discord-bot/logger/bot-logger'
import { capitalize } from 'src/discord-bot/utils/capitialize'
import { GuildService } from 'src/guild/guild.service'

const VERIFY_BUTTON_ID = 'verifyButton'
const VERIFY_MODAL_ID = 'verifyModal'
const VERIFY_CODE_ID = 'verifyCode'

@Command({
  name: 'verify',
  description: 'ยืนยันตัวตนน้องค่าย',
})
@Injectable()
export class VerifyCommand implements DiscordCommand {
  private readonly logger = new Logger(VerifyCommand.name)

  constructor(
    private campers: CamperRepository,
    private botLogger: BotLogger,
    private guildService: GuildService
  ) {
    this.logger.log(`${VerifyCommand.name} initialized`)
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions | void> {
    const camperId = await this.campers.getIdByDiscordId(interaction.user.id)

    if (camperId) {
      this.logger.error(`User ${interaction.user.id} is already registered`)
      await this.botLogger.log(interaction, `<@${interaction.user.id}> ยืนยันตัวซ้ำ`)
      return {
        content: 'คุณได้ยืนยันตัวตนไปแล้ว',
        ephemeral: true,
      }
    }

    const linkButton = new MessageButton()
      .setStyle('LINK')
      .setLabel('รับรหัสยืนยันตัวตน')
      .setURL('https://12.jwc.in.th/discord')

    const openModalButton = new MessageButton()
      .setCustomId(VERIFY_BUTTON_ID)
      .setStyle('PRIMARY')
      .setLabel('ยืนยันตัวตน')

    const row = new MessageActionRow().addComponents(linkButton, openModalButton)

    return {
      content:
        '🌈 ยินดีต้อนรับเข้าสู่ค่าย JWC12 อย่างเป็นทางการ! เพื่อยืนยันว่าคุณคือน้องค่ายของเราจริง ๆ รบกวนกรอกรหัสยืนยันตัวตนตามลิงก์ที่ให้ไปให้ถูกต้องด้วยนะ~',
      components: [row],
      ephemeral: true,
    }
  }

  @On('interactionCreate')
  async onInteractionCreate(interaction: Interaction) {
    if (interaction.isModalSubmit() && interaction.customId === VERIFY_MODAL_ID) {
      await this.onVerifyModalSubmit(interaction)
    } else if (interaction.isButton() && interaction.customId === VERIFY_BUTTON_ID) {
      await this.onVerifyButtonClick(interaction)
    }
  }

  private async onVerifyButtonClick(interaction: ButtonInteraction) {
    const modal = new Modal().setTitle('ยืนยันตัวตน').setCustomId(VERIFY_MODAL_ID)

    const verifyCodeInputComponent = new TextInputComponent()
      .setCustomId(VERIFY_CODE_ID)
      .setLabel('รหัสยืนยันตัวตน')
      .setStyle(TextInputStyles.SHORT)

    const rows = [verifyCodeInputComponent].map((component) =>
      new MessageActionRow<ModalActionRowComponent>().addComponents(component)
    )

    modal.addComponents(...rows)
    await interaction.showModal(modal)
  }

  private async onVerifyModalSubmit(modal: ModalSubmitInteraction) {
    const verifyCode = modal.fields.getTextInputValue(VERIFY_CODE_ID)

    if (verifyCode.length !== 6) {
      await this.botLogger.log(
        modal,
        `<@${modal.user.id}> รหัสยืนยันตัวตนไม่ถูกต้อง: ${verifyCode}`
      )
      await modal.update({
        content: 'รหัสยืนยันตัวตนไม่ถูกต้อง โปรดลองใหม่อีกครั้ง',
        components: [],
      })
      return
    }

    const camper = await this.campers.findByVerifyCode(verifyCode)
    if (camper === null) {
      await this.botLogger.log(
        modal,
        `<@${modal.user.id}> รหัสยืนยันตัวตนไม่ถูกต้อง: ${verifyCode}`
      )
      await modal.update({
        content: 'รหัสยืนยันตัวตนไม่ถูกต้อง โปรดลองใหม่อีกครั้ง',
        components: [],
      })
      return
    }

    try {
      await this.campers.associateToDiscordId(camper.id, modal.user.id)
      await this.guildService.assignRoleToId(modal.guild, 'CAMPER', modal.user.id)
      await this.guildService.assignRoleToId(modal.guild, camper.branch, modal.user.id)
      const branchAbbr = branchAbbreviations[camper.branch]
      await modal.guild.members.edit(modal.user.id, {
        nick: `[${branchAbbr}] ${camper.nickname} JWC12`,
      })
      await modal.update({
        content: `ยืนยันตัวตนสำเร็จ`,
        components: [],
      })
      await modal.channel.send({
        content: `🎉 ยินดีต้อนรับ น้อง ${camper.nickname} จากสาขา ${capitalize(camper.branch)}`,
        components: [],
      })
    } catch (err) {
      this.logger.error(err)
      await modal.update({
        content: `มีบางอย่างผิดพลาด โปรดลองอีกครั้ง`,
        components: [],
      })
    }
  }
}

const branchAbbreviations: Record<BranchType, string> = {
  CONTENT: 'CT',
  DESIGN: 'DS',
  MARKETING: 'MK',
  PROGRAMMING: 'PG',
}
