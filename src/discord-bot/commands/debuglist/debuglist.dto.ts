import { Param, ParamType } from '@discord-nestjs/core'

export class DebugListDTO {
  @Param({
    type: ParamType.ROLE,
    name: 'of',
    description: 'ระบุ role @',
    required: true,
  })
  target: string
}
