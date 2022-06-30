import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { DiscordModule, DiscordModuleOption } from '@discord-nestjs/core'
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
        registerCommandOptions: getRegisterCommandOptions(config),
      }),
    }),
    DiscordBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

type RegisterCommandOptions = DiscordModuleOption['registerCommandOptions'][number]

function getRegisterCommandOptions(config: ConfigService): RegisterCommandOptions[] {
  const guildsString = config.get('discord.guilds') as string
  const guilds = guildsString.split(',')
  const options: RegisterCommandOptions[] = guilds.map((guild) => ({
    forGuild: guild,
  }))
  return options
}
