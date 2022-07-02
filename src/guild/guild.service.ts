import { Injectable } from '@nestjs/common'

import { Guild } from 'discord.js'
import { PrismaService } from 'src/prisma/prisma.service'

import { RoleKey, roles } from './roles'

@Injectable()
export class GuildService {
  constructor(private prisma: PrismaService) {}

  async setup(guild: Guild) {
    await this.getGuildMetadata(guild.id)
    const roleKeys = Object.keys(roles) as RoleKey[]
    await Promise.all(roleKeys.map((roleKey) => this.getRole(guild, roleKey)))
  }

  async getGuildMetadata(guildId: string) {
    return await this.prisma.guildMetadata.upsert({
      where: { guildId: guildId },
      update: {},
      create: { guildId },
    })
  }

  async getRole(guild: Guild, roleKey: RoleKey) {
    const guildRole = await this.prisma.guildRole.findUnique({
      select: { roleId: true },
      where: { guildId_roleKey: { guildId: guild.id, roleKey: roleKey } },
    })
    if (guildRole) {
      return guild.roles.cache.get(guildRole.roleId)
    }

    const roleOptions = roles[roleKey]
    let role = guild.roles.cache.find((role) => role.name === roleOptions.name)
    if (!role) {
      role = await guild.roles.create(roles[roleKey])
    }
    await this.prisma.guildRole.create({
      data: {
        guildId: guild.id,
        roleKey: roleKey,
        roleId: role.id,
      },
    })
    return role
  }

  async assignRoleToId(guild: Guild, roleKey: RoleKey, discordId: string) {
    const role = await this.getRole(guild, roleKey)
    await guild.members.cache.get(discordId).roles.add(role)
  }

  async setLoggerChannel(guildId: string, channelId: string) {
    await this.prisma.guildMetadata.upsert({
      where: { guildId: guildId },
      update: { loggingChannel: channelId },
      create: { guildId: guildId, loggingChannel: channelId },
    })
  }

  async setErrorChannel(guildId: string, channelId: string) {
    await this.prisma.guildMetadata.upsert({
      where: { guildId: guildId },
      update: { errorChannel: channelId },
      create: { guildId: guildId, errorChannel: channelId },
    })
  }

  async getDiscordIdsByRole(guild: Guild, roleId: string) {
    const members = await guild.members.fetch()
    const roleMembers = members.filter((member) => member.roles.cache.has(roleId))
    return roleMembers.map((member) => member.id)
  }
}
