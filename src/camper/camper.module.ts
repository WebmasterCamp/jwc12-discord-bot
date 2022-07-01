import { Module } from '@nestjs/common'

import { PrismaModule } from 'src/prisma/prisma.module'

import { CamperRepository } from './camper.repository'

@Module({
  imports: [PrismaModule],
  providers: [CamperRepository],
  exports: [CamperRepository],
})
export class CamperModule {}
