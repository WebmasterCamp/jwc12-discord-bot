type GrantTargetType = 'user' | 'role'

export interface GrantCoinUpdateMeta {
  type: 'grant'
  staffDiscordId: string
  targetType: GrantTargetType
  targetDiscordId: string
}

export interface GiveCoinUpdateMeta {
  type: 'give'
  giveToId: string
}

export interface GivenCoinUpdateMeta {
  type: 'given'
  givenById: string
}

export interface StealCoinUpdateMeta {
  type: 'steal'
  stealFromId: string
}

export interface StolenCoinUpdateMeta {
  type: 'stolen'
  stolenById: string
}

export interface GiveStealPenaltyCoinUpdateMeta {
  type: 'give-steal-penalty'
  giveToId: string
}

export interface GivenStealPenaltyCoinUpdateMeta {
  type: 'given-steal-penalty'
  givenById: string
}

export type CoinUpdateMeta =
  | GrantCoinUpdateMeta
  | GiveCoinUpdateMeta
  | GivenCoinUpdateMeta
  | StealCoinUpdateMeta
  | StolenCoinUpdateMeta
  | GiveStealPenaltyCoinUpdateMeta
  | GivenStealPenaltyCoinUpdateMeta
