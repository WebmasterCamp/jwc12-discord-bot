export interface BaseMention {
  rawValue: string
}

export interface UserMention extends BaseMention {
  type: 'user'
  userId: string
}

export interface RoleMention extends BaseMention {
  type: 'role'
  roleId: string
}

export interface ChannelMention extends BaseMention {
  type: 'channel'
  channelId: string
}

export type Mention = UserMention | RoleMention | ChannelMention
