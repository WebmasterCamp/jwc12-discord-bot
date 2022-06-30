import { Injectable } from '@nestjs/common'

import { Command } from '@discord-nestjs/core'

import { RoleAdminSubCommand } from './role-admin.subcommand'
import { RoleGiverSubCommand } from './role-giver.subcommand'

@Command({
  name: 'role',
  description: 'ให้ role กับ user',
  include: [RoleGiverSubCommand, RoleAdminSubCommand],
})
@Injectable()
export class RoleCommand {}
