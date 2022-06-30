import { BranchType } from '@prisma/client'
import { ColorResolvable, CreateRoleOptions, Interaction, Permissions, Role } from 'discord.js'
import { PrismaService } from 'src/prisma.service'

export const RoleName = {
  CAMPER: 'Camper',
  ADMIN: 'Admin',
  GIVER: 'Giver',
  STAFF: 'Staff',
  [BranchType.CONTENT]: 'Content',
  [BranchType.DESIGN]: 'Design',
  [BranchType.MARKETING]: 'Marketing',
  [BranchType.PROGRAMMING]: 'Programming',
} as const

const TeamColorMapper: Record<BranchType, ColorResolvable> = {
  [BranchType.CONTENT]: 'AQUA',
  [BranchType.DESIGN]: 'GOLD',
  [BranchType.MARKETING]: 'PURPLE',
  [BranchType.PROGRAMMING]: 'BLURPLE',
}

export const createCamperRoleOptions = (): CreateRoleOptions => ({
  name: RoleName.CAMPER,
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
})

export const createGiverRoleOption = (): CreateRoleOptions => ({
  name: RoleName.GIVER,
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
})

export const createAdminRoleOption = (): CreateRoleOptions => ({
  name: RoleName.ADMIN,
  color: 'RED',
  mentionable: true,
  position: 999999,
  permissions: [Permissions.ALL],
})

export const createTeamRoleOptions = (name: BranchType): CreateRoleOptions => ({
  name: RoleName[name],
  color: TeamColorMapper[name],
  mentionable: true,
})

export const findOrCreateRole = async (
  interaction: Interaction,
  roleConfig: CreateRoleOptions,
  roleId?: string | null
): Promise<Role> => {
  let role: Role
  const guild = await interaction.guild.fetch()

  if (guild.roles.cache.some((role) => role.id === roleId)) {
    role = guild.roles.cache.find((role) => role.id === roleId)
    role.setPermissions(roleConfig.permissions)
  } else {
    role = await guild.roles.create(roleConfig)
  }

  return role
}
