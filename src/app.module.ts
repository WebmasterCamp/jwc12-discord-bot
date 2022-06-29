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
      isGlobal: true,
    }),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        token: config.get('discord.token'),
        discordClientOptions: {
          intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MEMBERS,
          ],
        },
        registerCommandOptions: [
          {
            // TEST SERVER
            forGuild: '748542488645730305',
            removeCommandsBefore: true,
          },
          {
            // PRODUCTION SERVER - JWC12
            forGuild: '990970125119291432',
            removeCommandsBefore: true,
          },
        ],
      }),
    }),
    DiscordBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
