import { Module } from '@nestjs/common'

import { ReflectMetadataProvider } from '@discord-nestjs/core'
import { PrismaService } from 'src/prisma.service'

import { BalanceCommand } from './balance/balance.command'
import { GiveCommand } from './give/give.command'
import { LoggerCommand } from './logger/logger.command'
import { MeCommand } from './me/me.command'
import { PingCommand } from './ping/ping.command'
import { RoleAdminSubCommand } from './role/role-admin.subcommand'
import { RoleGiverSubCommand } from './role/role-giver.subcommand'
import { RoleCommand } from './role/role.command'
import { VerifyCommand } from './verify/verify.command'

@Module({
  providers: [
    ReflectMetadataProvider,
    PrismaService,
    PingCommand,
    MeCommand,
    VerifyCommand,
    LoggerCommand,
    BalanceCommand,
    RoleCommand,
    RoleGiverSubCommand,
    RoleAdminSubCommand,
    GiveCommand,
  ],
})
export class DiscordBotSlashCommands {}
