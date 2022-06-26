import { Module } from '@nestjs/common'

import { PrismaService } from '@app/prisma.service'

import { MeCommand } from './me/me.command'
import { PingCommand } from './ping/ping.command'

@Module({
  providers: [PrismaService, PingCommand, MeCommand],
})
export class DiscordBotSlashCommands {}
