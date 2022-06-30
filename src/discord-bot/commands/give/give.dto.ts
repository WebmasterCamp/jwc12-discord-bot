import { Param } from '@discord-nestjs/core'
import { Transform } from 'class-transformer'

export class GiveAllDTO {
  @Param({
    name: 'amount',
    description: 'แต้มบุญที่จะให้',
    required: true,
  })
  amount: string
}

export class GiveCamperDTO {
  @Transform(({ value }) => value.slice(3).slice(0, -1))
  @Param({
    name: 'user',
    description: 'ระบุชื่อผู้ใช้ @',
    required: true,
  })
  user: string

  @Param({
    name: 'amount',
    description: 'แต้มบุญที่จะให้',
    required: true,
  })
  amount: string
}
