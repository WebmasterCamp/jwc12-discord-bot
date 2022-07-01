import { Param, ParamType } from '@discord-nestjs/core'

export class GiveDTO {
  @Param({
    type: ParamType.USER,
    name: 'to',
    description: 'ชื่อเพื่อนที่จะโอนแต้มบุญให้',
    required: true,
  })
  to: string

  @Param({
    type: ParamType.INTEGER,
    name: 'amount',
    description: 'จำนวนแต้มบุญที่จะโอนให้',
    required: true,
  })
  amount: number
}
