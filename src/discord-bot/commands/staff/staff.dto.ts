import { Param, ParamType } from '@discord-nestjs/core'

export class StaffDTO {
  @Param({
    type: ParamType.USER,
    name: 'user',
    description: 'ระบุชื่อผู้ใช้',
    required: true,
  })
  user: string

  @Param({
    name: 'nickname',
    description: 'ชื่อเล่น',
    required: true,
  })
  nickname: string
}
