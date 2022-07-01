import { Param } from '@discord-nestjs/core'

export class LoggerDto {
  @Param({
    name: 'channel',
    description: 'ระบุชื่อ channel',
    required: true,
  })
  channel: string
}
