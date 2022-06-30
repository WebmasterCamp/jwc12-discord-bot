import { Param } from '@discord-nestjs/core'

export class GiveAllDTO {
  @Param({
    name: 'amount',
    description: 'แต้มบุญที่จะให้',
    required: true,
  })
  amount: string
}
