import { Injectable, Logger } from '@nestjs/common'

import { TransformPipe } from '@discord-nestjs/common'
import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UseGuards,
  UsePipes,
} from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'
import { IsAdminInteractionGuard } from 'src/discord-bot/guard/is-admin.guard'
import { PrismaService } from 'src/prisma.service'

import { LoggerDto } from './logger.dto'

@Command({
  name: 'logger',
  description: 'Assign logger to channel',
})
@Injectable()
@UsePipes(TransformPipe)
@UseGuards(IsAdminInteractionGuard)
export class LoggerCommand implements DiscordTransformedCommand<LoggerDto> {
  private readonly logger = new Logger(LoggerCommand.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${LoggerCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: LoggerDto,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    try {
      await this.prisma.guildMetadata.upsert({
        where: { guildId: interaction.guildId },
        update: { loggingChannel: dto.channel },
        create: { guildId: interaction.guildId, loggingChannel: dto.channel },
      })
      return {
        content: `ตั้งค่าการแจ้งเตือนไปที่ <#${dto.channel}>`,
        ephemeral: true,
      }
    } catch (err) {
      return {
        content: `มีข้อผิดพลาด ${err.message}`,
        ephemeral: true,
      }
    }
  }
}
