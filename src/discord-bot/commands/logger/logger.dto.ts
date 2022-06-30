import { Param } from '@discord-nestjs/core'
import { Transform } from 'class-transformer'

export class LoggerDto {
  @Transform(({ value }) => value.slice(2).slice(0, -1))
  @Param({
    name: 'channel',
    description: 'ระบุชื่อ channel',
    required: true,
  })
  channel: string
}
