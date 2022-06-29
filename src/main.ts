import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { PrismaService } from './prisma.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  await app.init()
  const config = app.get(ConfigService)
  const port = config.get('port') ?? 3000

  const prismaService = app.get(PrismaService)
  await prismaService.enableShutdownHooks(app)

  await app.listen(port)
  const logger = new Logger('Main')
  logger.log(`Application is running on port ${port}`)
}

bootstrap()
