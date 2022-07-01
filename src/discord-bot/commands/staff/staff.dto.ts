import { Param } from '@discord-nestjs/core'

export class StaffDTO {
  @Param({
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

  @Param({
    name: 'gen',
    description: 'รุ่น เช่น JWC11, YWC18',
    required: true,
  })
  gen: string
}
