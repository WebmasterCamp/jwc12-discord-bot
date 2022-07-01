import { Param, ParamType } from '@discord-nestjs/core'

export class GrantDTO {
  @Param({
    type: ParamType.MENTIONABLE,
    name: 'target',
    description: 'ระบุชื่อผู้ใช้ หรือ role @',
    required: true,
  })
  target: string

  @Param({
    type: ParamType.INTEGER,
    name: 'amount',
    description: 'แต้มบุญที่จะให้',
    required: true,
  })
  amount: number
}
