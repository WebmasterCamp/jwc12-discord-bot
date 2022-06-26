import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { DiscordModule } from '@discord-nestjs/core'
import { Intents } from 'discord.js'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { configuration } from './config/configuration'
import { DiscordBotModule } from './discord-bot/discord-bot.module'

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
