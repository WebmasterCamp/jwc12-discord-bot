import { Param } from '@discord-nestjs/core'
import { Transform } from 'class-transformer'

export class RoleDto {
  @Transform(({ value }) => value.slice(3).slice(0, -1))
  @Param({
    name: 'user',
    description: 'ระบุชื่อผู้ใช้ @',
    required: true,
  })
  user: string
}
