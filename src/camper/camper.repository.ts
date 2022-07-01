import { Injectable, Logger } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class CamperRepository {
  private readonly logger = new Logger(CamperRepository.name)

  constructor(private prisma: PrismaService) {
    this.logger.log(`${CamperRepository.name} initialized`)
  }
}
