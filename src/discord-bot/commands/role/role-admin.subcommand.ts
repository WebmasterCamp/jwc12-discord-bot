import { Injectable, Logger } from '@nestjs/common'

import { TransformPipe } from '@discord-nestjs/common'
import {
  DiscordTransformedCommand,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UseGuards,
  UsePipes,
} from '@discord-nestjs/core'
import { Interaction, InteractionReplyOptions } from 'discord.js'
import { IsAdminInteractionGuard } from 'src/discord-bot/guard/is-admin.guard'
import { createAdminRoleOption, findOrCreateRole } from 'src/discord-bot/utils/role'
import { PrismaService } from 'src/prisma/prisma.service'

import { RoleDto } from './role.dto'

@SubCommand({
  name: 'admin',
  description: 'ให้ role Admin กับ user',
})
@Injectable()
@UsePipes(TransformPipe)
@UseGuards(IsAdminInteractionGuard)
export class RoleAdminSubCommand implements DiscordTransformedCommand<RoleDto> {
  private readonly logger = new Logger(RoleAdminSubCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${RoleAdminSubCommand.name} initialized`)
  }

  async assignRoleToAdmin(interaction: Interaction, userId: string) {
    const guild = await interaction.guild.fetch()

    const metadata = await this.prisma.guildMetadata.findUnique({
      where: { guildId: guild.id },
    })

    const adminRoleOption = createAdminRoleOption()
    const adminRole = await findOrCreateRole(interaction, adminRoleOption, metadata?.adminRole)
    await guild.members.cache.get(userId).roles.add(adminRole)

    await this.prisma.guildMetadata.upsert({
      where: { guildId: guild.id },
      create: { guildId: guild.id, adminRole: adminRole.id },
      update: { adminRole: adminRole.id },
    })

    return adminRole
  }

  async handler(
    @Payload() dto: RoleDto,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    try {
      const userId = interaction.user.id
      const ownerId = interaction.guild.ownerId

      if (userId === ownerId && userId === dto.user) {
        const adminRole = await this.assignRoleToAdmin(interaction, userId)
        return {
          content: `<@${userId}> ได้มอบ <@&${adminRole.id}> ให้กับ <@${dto.user}> แล้ว`,
        }
      }

      const metadata = await this.prisma.guildMetadata.findUnique({
        where: { guildId: interaction.guildId },
      })

      if (!metadata) {
        return {
          content: `ต้องให้เจ้าของ Server <@${ownerId}> เป็น Admin คนแรกก่อน จากนั้นเจ้าของ Server จึงจะให้ Admin กับคนอื่นได้`,
        }
      }

      const adminRole = await this.assignRoleToAdmin(interaction, dto.user)
      return {
        content: `<@${userId}> ได้มอบ <@&${adminRole.id}> ให้กับ <@${dto.user}> แล้ว`,
      }
    } catch (err) {
      this.logger.error(err)
      return {
        content: `มีบางอย่างผิดพลาด`,
      }
    }
  }
}
