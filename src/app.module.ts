import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { DiscordModule, DiscordModuleOption } from '@discord-nestjs/core'
import { Intents } from 'discord.js'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CamperModule } from './camper/camper.module'
import { configuration } from './config/configuration'
import { DiscordBotModule } from './discord-bot/discord-bot.module'
import { GuildModule } from './guild/guild.module'
import { PrismaModule } from './prisma/prisma.module'

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
    PrismaModule,
    CamperModule,
    GuildModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

type RegisterCommandOptions = DiscordModuleOption['registerCommandOptions'][number]

function getRegisterCommandOptions(config: ConfigService): RegisterCommandOptions[] {
  const guildsString = config.get<string>('discord.guilds')
  const guilds = guildsString.split(',')
  const options: RegisterCommandOptions[] = guilds.map((guild) => ({
    forGuild: guild,
    removeCommandsBefore: config.get<boolean>('production'),
  }))
  return options
}
