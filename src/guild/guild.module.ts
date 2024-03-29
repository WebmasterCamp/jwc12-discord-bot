import { Module } from '@nestjs/common'

import { PrismaModule } from 'src/prisma/prisma.module'

import { GuildService } from './guild.service'

@Module({
  imports: [PrismaModule],
  providers: [GuildService],
  exports: [GuildService],
})
export class GuildModule {}
