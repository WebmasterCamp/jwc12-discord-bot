import { Param } from '@discord-nestjs/core'

export class GiveDTO {
  @Param({
    name: 'target',
    description: 'ระบุชื่อผู้ใช้ หรือ role @',
    required: true,
  })
  target: string

  @Param({
    name: 'amount',
    description: 'แต้มบุญที่จะให้',
    required: true,
  })
  amount: string
}
