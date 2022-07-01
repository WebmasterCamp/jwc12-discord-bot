import { Param, ParamType } from '@discord-nestjs/core'

export class ViewBalanceDTO {
  @Param({
    type: ParamType.MENTIONABLE,
    name: 'of',
    description: 'ระบุชื่อผู้ใช้ หรือ role @',
    required: true,
  })
  target: string
}
