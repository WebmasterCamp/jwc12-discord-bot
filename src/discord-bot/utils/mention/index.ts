import { Mention } from './types'

export * from './types'

export function parseMention(rawValue: string): Mention | null {
  let mention = rawValue
  if (!mention.startsWith('<@') || !mention.endsWith('>')) return null

  mention = mention.slice(2, -1)
  if (mention.startsWith('!')) {
    mention = mention.slice(1)
  }
  if (mention.startsWith('&')) {
    return {
      rawValue,
      type: 'role',
      roleId: mention.slice(1),
    }
  }
  if (mention.startsWith('#')) {
    return {
      rawValue,
      type: 'channel',
      channelId: mention.slice(1),
    }
  }
  return {
    rawValue,
    type: 'user',
    userId: mention,
  }
}
