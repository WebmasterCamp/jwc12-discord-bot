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
import { IsGiverInteractionGuard } from 'src/discord-bot/guard/is-giver.guard'
import { createGiverRoleOption, findOrCreateRole } from 'src/discord-bot/utils/role'
import { PrismaService } from 'src/prisma/prisma.service'

import { RoleDto } from './role.dto'

@SubCommand({
  name: 'giver',
  description: 'ให้ role Giver กับ user',
})
@Injectable()
@UsePipes(TransformPipe)
@UseGuards(IsGiverInteractionGuard)
export class RoleGiverSubCommand implements DiscordTransformedCommand<RoleDto> {
  private readonly logger = new Logger(RoleGiverSubCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${RoleGiverSubCommand.name} initialized`)
  }

  async assignRoleToGiver(interaction: Interaction, targetId: string) {
    const guild = await interaction.guild.fetch()
    const userId = targetId

    const metadata = await this.prisma.guildMetadata.findUnique({
      where: { guildId: guild.id },
    })

    const giverRoleOption = createGiverRoleOption()
    const giverRole = await findOrCreateRole(interaction, giverRoleOption, metadata?.giverRole)
    await guild.members.cache.get(userId).roles.add(giverRole)

    await this.prisma.guildMetadata.upsert({
      where: { guildId: guild.id },
      create: { guildId: guild.id, giverRole: giverRole.id },
      update: { giverRole: giverRole.id },
    })

    return giverRole
  }

  async handler(
    @Payload() dto: RoleDto,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    try {
      const userId = interaction.user.id
      const ownerId = interaction.guild.ownerId

      const metadata = await this.prisma.guildMetadata.findUnique({
        where: { guildId: interaction.guildId },
      })

      if (!metadata) {
        return {
          content: `ต้องให้เจ้าของ Server <@${ownerId}> เป็น Admin คนแรกก่อน จากนั้นเจ้าของ Server จึงจะให้ Admin กับคนอื่นได้`,
        }
      }

      const giverRole = await this.assignRoleToGiver(interaction, dto.user)
      return {
        content: `<@${userId}> ได้มอบ <@&${giverRole.id}> ให้กับ <@${dto.user}> แล้ว`,
      }
    } catch (err) {
      this.logger.error(err)
      return {
        content: `มีบางอย่างผิดพลาด`,
      }
    }
  }
}
