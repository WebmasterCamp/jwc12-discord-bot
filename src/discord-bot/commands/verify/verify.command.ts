import { Injectable, Logger } from '@nestjs/common'

import {
  Command,
  DiscordCommand,
  InteractionEventCollector,
  On,
  UseCollectors,
  UseGuards,
} from '@discord-nestjs/core'
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
import { IsModalInteractionGuard } from 'src/discord-bot/guard'
import { capitalize } from 'src/discord-bot/utils/capitialize'
import { notifyLogging } from 'src/discord-bot/utils/logging'
import { createCamperRoleOptions, findOrCreateRole } from 'src/discord-bot/utils/role'
import { PrismaService } from 'src/prisma.service'

const VERIFY_BUTTON_ID = 'verifyButton'
const VERIFY_MODAL_ID = 'verifyModal'
const VERIFY_CODE_ID = 'verifyCode'

@InteractionEventCollector({ time: 15000 })
class VerifyInteractionCollector {
  private readonly logger = new Logger(VerifyInteractionCollector.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${VerifyInteractionCollector.name} initialized`)
  }

  @On('collect')
  async onCollect(interaction: ButtonInteraction): Promise<void> {
    if (interaction.customId !== VERIFY_BUTTON_ID) return

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
}

@Command({
  name: 'verify',
  description: 'ยืนยันตัวตนน้องค่าย',
})
@UseCollectors(VerifyInteractionCollector)
@Injectable()
export class VerifyCommand implements DiscordCommand {
  private readonly logger = new Logger(VerifyCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${VerifyCommand.name} initialized`)
  }

  async assignRoleToCamper(interaction: Interaction) {
    const guild = await interaction.guild.fetch()
    const userId = interaction.user.id

    const metadata = await this.prisma.guildMetadata.findUnique({
      where: { guildId: guild.id },
    })

    const camperRoleOption = createCamperRoleOptions()
    const camperRole = await findOrCreateRole(interaction, camperRoleOption, metadata?.camperRole)
    await guild.members.cache.get(userId).roles.add(camperRole)

    await this.prisma.guildMetadata.upsert({
      where: { guildId: guild.id },
      create: { guildId: guild.id, camperRole: camperRole.id },
      update: { camperRole: camperRole.id },
    })
  }

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions | void> {
    const account = await this.prisma.discordAccount.findUnique({
      select: { discordId: true },
      where: { discordId: interaction.user.id },
    })

    if (account) {
      this.logger.error(`User ${interaction.user.id} is already registered`)
      await notifyLogging(this.prisma, interaction, `<@${interaction.user.id}> ยืนยันตัวซ้ำ`)
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
  @UseGuards(IsModalInteractionGuard)
  async onModuleSubmit(modal: ModalSubmitInteraction) {
    this.logger.log(`Modal ${modal.customId} submit`)

    if (modal.customId !== VERIFY_MODAL_ID) return

    const verifyCode = modal.fields.getTextInputValue(VERIFY_CODE_ID)

    if (verifyCode.length !== 6) {
      await notifyLogging(this.prisma, modal, `<@${modal.user.id}> รหัสยืนยันตัวตนไม่ถูกต้อง`)
      await modal.reply({ content: 'รหัสยืนยันตัวตนไม่ถูกต้อง', ephemeral: true })
      return
    }

    const camper = await this.prisma.camper.findFirst({
      select: { id: true, nickname: true, branch: true },
      where: {
        firebaseId: { startsWith: verifyCode },
      },
    })
    if (camper === null) {
      await modal.reply({ content: 'รหัสยืนยันตัวตนไม่ถูกต้อง', ephemeral: true })
      return
    }

    try {
      await this.prisma.camper.update({
        data: {
          discordAccounts: {
            create: { discordId: modal.user.id },
          },
        },
        where: { id: camper.id },
      })
      await this.assignRoleToCamper(modal)
      await modal.reply({
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
