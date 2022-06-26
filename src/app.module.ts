import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Intents } from 'discord.js';
import { DiscordBotModule } from './discord-bot/discord-bot.module';
import { DiscordBotSlashCommands } from './discord-bot/commands/commands.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DiscordModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        token: config.get('discord.token'),
        discordClientOptions: {
          intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
        },
      }),
    }),
    DiscordBotModule,
    DiscordBotSlashCommands,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
