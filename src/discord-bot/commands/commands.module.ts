import { Module } from '@nestjs/common'

import { PrismaService } from 'src/prisma.service'

import { MeCommand } from './me/me.command'
import { PingCommand } from './ping/ping.command'
import { PointCommand } from './point/point.command'
import { VerifyCommand } from './verify/verify.command'

@Module({
  providers: [PrismaService, PingCommand, MeCommand, VerifyCommand, PointCommand],
})
export class DiscordBotSlashCommands {}
