import { Injectable, Logger } from '@nestjs/common'

import { TransformPipe } from '@discord-nestjs/common'
import {
  Command,
  DiscordTransformedCommand,
  Payload,
  TransformedCommandExecutionContext,
  UseFilters,
  UsePipes,
} from '@discord-nestjs/core'
import { Formatters, InteractionReplyOptions } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'
import { NotRegisteredError } from 'src/discord-bot/errors'

import { CommandErrorFilter } from '../error-filter'
import { GiveDTO } from './give.dto'

@Command({
  name: 'give',
  description: 'โอนแต้มบุญให้เพื่อน',
})
@Injectable()
@UsePipes(TransformPipe)
@UseFilters(CommandErrorFilter)
export class GiveCommand implements DiscordTransformedCommand<GiveDTO> {
  private readonly logger = new Logger(GiveCommand.name)

  constructor(private campers: CamperRepository) {
    this.logger.log(`${GiveCommand.name} initialized`)
  }

  async handler(
    @Payload() dto: GiveDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    const from = await this.campers.getByDiscordId(interaction.user.id)
    if (!from) throw new NotRegisteredError()

    const toId = await this.campers.getIdByDiscordId(dto.to)
    if (!toId) {
      return {
        content: 'โปรดใส่ชื่อเพื่อนที่จะโอนแต้มบุญให้',
        ephemeral: true,
      }
    }
    if (from.id === toId) {
      return {
        content: 'ไม่สามารถโอนแต้มบุญให้ตัวเองได้',
        ephemeral: true,
      }
    }
    if (dto.amount <= 0) {
      return {
        content: 'จำนวนแต้มบุญที่โอนต้องมากกว่า 0',
        ephemeral: true,
      }
    }
    if (from.coins < dto.amount) {
      return {
        content: `น้อง ${Formatters.userMention(
          interaction.user.id
        )} มีแต้มบุญไม่พอ ยังจะโอนให้เพื่อนอีกเหรอ`,
      }
    }
    await this.campers.transferCoin(from.id, toId, dto.amount)
    return {
      content: `${Formatters.userMention(
        interaction.user.id
      )} โอนแต้มบุญให้ ${Formatters.userMention(dto.to)} ${dto.amount} แต้มบุญ`,
    }
  }
}
