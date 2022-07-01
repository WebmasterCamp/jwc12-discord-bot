import { Module } from '@nestjs/common'

import { DiscordModule } from '@discord-nestjs/core'
import { GuildModule } from 'src/guild/guild.module'

import { DiscordBotSlashCommands } from './commands/commands.module'
import { DiscordBotGateway } from './discord-bot.gateway'
import { BotLogger } from './logger/bot-logger'

@Module({
  imports: [DiscordModule.forFeature(), DiscordBotSlashCommands, GuildModule],
  providers: [DiscordBotGateway, BotLogger],
  exports: [BotLogger],
})
export class DiscordBotModule {}
