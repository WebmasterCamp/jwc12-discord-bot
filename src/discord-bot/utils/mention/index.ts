import { Formatters, Guild } from 'discord.js'

import { Mention } from './types'

export * from './types'

export function parseMention(formatted: string): Mention | null {
  let mention = formatted
  if (mention.startsWith('<#') && mention.endsWith('>')) {
    return {
      formatted,
      type: 'channel',
      channelId: mention.slice(2, -1),
    }
  }
  if (!mention.startsWith('<@') || !mention.endsWith('>')) return null

  mention = mention.slice(2, -1)
  if (mention.startsWith('!')) {
    mention = mention.slice(1)
  }
  if (mention.startsWith('&')) {
    return {
      formatted,
      type: 'role',
      roleId: mention.slice(1),
    }
  }
  return {
    formatted,
    type: 'user',
    userId: mention,
  }
}

export async function mentionFromId(guild: Guild, id: string): Promise<Mention> {
  await guild.fetch()
  if (guild.roles.cache.get(id)) {
    return {
      formatted: Formatters.roleMention(id),
      type: 'role',
      roleId: id,
    }
  } else if (guild.channels.cache.get(id)) {
    return {
      formatted: Formatters.channelMention(id),
      type: 'channel',
      channelId: id,
    }
  } else {
    return {
      formatted: Formatters.userMention(id),
      type: 'user',
      userId: id,
    }
  }
}
