import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { DiscordBotGateway } from './discord-bot.gateway';
import { DiscordBotService } from './discord-bot.service';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [DiscordBotService, DiscordBotGateway],
})
export class DiscordBotModule {}
