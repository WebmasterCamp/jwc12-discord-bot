import { BranchType } from '@prisma/client'
import { ColorResolvable, CreateRoleOptions, Permissions } from 'discord.js'
import { capitalize } from 'src/discord-bot/utils/capitialize'

export type RoleKey = 'ADMIN' | 'STAFF' | 'CAMPER' | BranchType

const BranchColorMapper: Record<BranchType, ColorResolvable> = {
  [BranchType.CONTENT]: 'AQUA',
  [BranchType.DESIGN]: 'GOLD',
  [BranchType.MARKETING]: 'PURPLE',
  [BranchType.PROGRAMMING]: 'BLURPLE',
}

export const roles: Record<RoleKey, CreateRoleOptions> = {
  ADMIN: {
    name: 'Admin',
    color: 'RED',
    mentionable: true,
    position: 999999,
    permissions: [Permissions.ALL],
  },
  STAFF: {
    name: 'Staff',
    color: 'BLUE',
    mentionable: true,
    position: 1000,
    permissions: [
      Permissions.FLAGS.ADD_REACTIONS,
      Permissions.FLAGS.ATTACH_FILES,
      Permissions.FLAGS.CONNECT,
      Permissions.FLAGS.SPEAK,
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
      Permissions.FLAGS.USE_EXTERNAL_STICKERS,
      Permissions.FLAGS.USE_PUBLIC_THREADS,
      Permissions.FLAGS.USE_PRIVATE_THREADS,
      Permissions.FLAGS.EMBED_LINKS,
    ],
  },
  CAMPER: {
    name: 'Camper',
    color: 'ORANGE',
    mentionable: true,
    permissions: [
      Permissions.FLAGS.ADD_REACTIONS,
      Permissions.FLAGS.ATTACH_FILES,
      Permissions.FLAGS.CONNECT,
      Permissions.FLAGS.SPEAK,
      Permissions.FLAGS.USE_EXTERNAL_EMOJIS,
      Permissions.FLAGS.USE_EXTERNAL_STICKERS,
      Permissions.FLAGS.USE_PUBLIC_THREADS,
      Permissions.FLAGS.USE_PRIVATE_THREADS,
      Permissions.FLAGS.EMBED_LINKS,
    ],
  },
  CONTENT: createBranchRoleOptions(BranchType.CONTENT),
  DESIGN: createBranchRoleOptions(BranchType.DESIGN),
  MARKETING: createBranchRoleOptions(BranchType.MARKETING),
  PROGRAMMING: createBranchRoleOptions(BranchType.PROGRAMMING),
}

function createBranchRoleOptions(name: BranchType): CreateRoleOptions {
  return {
    name: `${capitalize(name)}`,
    color: BranchColorMapper[name],
    mentionable: true,
  }
}
