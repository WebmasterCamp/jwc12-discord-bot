import { Module, forwardRef } from '@nestjs/common'

import { ReflectMetadataProvider } from '@discord-nestjs/core'
import { CamperModule } from 'src/camper/camper.module'
import { GuildModule } from 'src/guild/guild.module'
import { PrismaModule } from 'src/prisma/prisma.module'

import { DiscordBotModule } from '../discord-bot.module'
import { BalanceCommand } from './balance/balance.command'
import { ClearCommand } from './clear/clear.command'
import { DebugListCommand } from './debuglist/debuglist.command'
import { GiveCommand } from './give/give.command'
import { GrantCommand } from './grant/grant.command.ts'
import { LoggerErrorsSubCommand } from './logger/logger-errors.command'
import { LoggerEventsSubCommand } from './logger/logger-events.command'
import { LoggerCommand } from './logger/logger.command'
import { MeCommand } from './me/me.command'
import { PingCommand } from './ping/ping.command'
import { RankBranchSubCommand } from './rank/rank-branch.command'
import { RankIndividualSubCommand } from './rank/rank-individual.command'
import { RankStealSubCommand } from './rank/rank-steal.command'
import { RankStolenSubCommand } from './rank/rank-stolen-command'
import { RankTeamSubCommand } from './rank/rank-team.command'
import { RankCommand } from './rank/rank.command'
import { SetupCommand } from './setup/setup.command'
import { StaffCommand } from './staff/staff.command'
import { VerifyCommand } from './verify/verify.command'
import { ViewBalanceCommand } from './viewbalance/viewbalance.command'

@Module({
  imports: [forwardRef(() => DiscordBotModule), PrismaModule, CamperModule, GuildModule],
  providers: [
    ReflectMetadataProvider,
    PingCommand,
    MeCommand,
    VerifyCommand,
    LoggerCommand,
    LoggerEventsSubCommand,
    LoggerErrorsSubCommand,
    BalanceCommand,
    ViewBalanceCommand,
    RankCommand,
    RankIndividualSubCommand,
    RankBranchSubCommand,
    RankStealSubCommand,
    RankStolenSubCommand,
    DebugListCommand,
    RankTeamSubCommand,
    GiveCommand,
    GrantCommand,
    SetupCommand,
    StaffCommand,
    ClearCommand,
  ],
})
export class DiscordBotSlashCommands {}
