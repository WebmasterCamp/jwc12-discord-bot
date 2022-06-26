import { Module } from '@nestjs/common'

import { DiscordModule } from '@discord-nestjs/core'

import { DiscordBotSlashCommands } from './commands/commands.module'
import { DiscordBotGateway } from './discord-bot.gateway'

@Module({
  imports: [DiscordModule.forFeature(), DiscordBotSlashCommands],
  providers: [DiscordBotGateway],
})
export class DiscordBotModule {}
