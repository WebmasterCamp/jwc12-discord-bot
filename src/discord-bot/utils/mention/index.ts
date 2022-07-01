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
