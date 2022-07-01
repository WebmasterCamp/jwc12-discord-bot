import { Module, forwardRef } from '@nestjs/common'

import { ReflectMetadataProvider } from '@discord-nestjs/core'
import { CamperModule } from 'src/camper/camper.module'
import { GuildModule } from 'src/guild/guild.module'
import { PrismaModule } from 'src/prisma/prisma.module'

import { DiscordBotModule } from '../discord-bot.module'
import { BalanceCommand } from './balance/balance.command'
import { GiveCommand } from './give/give.command'
import { LoggerCommand } from './logger/logger.command'
import { MeCommand } from './me/me.command'
import { PingCommand } from './ping/ping.command'
import { VerifyCommand } from './verify/verify.command'

@Module({
  imports: [forwardRef(() => DiscordBotModule), PrismaModule, CamperModule, GuildModule],
  providers: [
    ReflectMetadataProvider,
    PingCommand,
    MeCommand,
    VerifyCommand,
    LoggerCommand,
    BalanceCommand,
    GiveCommand,
  ],
})
export class DiscordBotSlashCommands {}
