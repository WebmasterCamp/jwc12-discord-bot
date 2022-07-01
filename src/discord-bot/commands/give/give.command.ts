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
import { Camper } from '@prisma/client'
import { Formatters, InteractionReplyOptions } from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'
import { NotRegisteredError } from 'src/discord-bot/errors'

import { CommandErrorFilter } from '../error-filter'
import { GiveDTO } from './give.dto'

const STEAL_SUCCESS_RATE = 0.4
const STEAL_PENALTY_MULTIPLIER = 1.5
const STEAL_MAX_FRACTION = 0.2

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

    const to = await this.campers.getByDiscordId(dto.to)
    if (!to) {
      return {
        content: 'โปรดใส่ชื่อเพื่อนที่จะโอนแต้มบุญให้',
        ephemeral: true,
      }
    }
    if (from.id === to.id) {
      return {
        content: 'ไม่สามารถโอนแต้มบุญให้ตัวเองได้',
        ephemeral: true,
      }
    }
    if (dto.amount == 0) {
      return {
        content: 'จำนวนแต้มบุญที่โอนต้องมากกว่า 0 แต้ม',
        ephemeral: true,
      }
    }

    if (dto.amount > 0) {
      return await this.give(interaction.user.id, dto.to, from, to, dto.amount)
    }

    if (dto.amount < 0) {
      return await this.steal(interaction.user.id, dto.to, from, to, -dto.amount)
    }
  }

  private async give(
    fromDiscordId: string,
    toDiscordId: string,
    from: Camper,
    to: Camper,
    amount: number
  ): Promise<InteractionReplyOptions> {
    if (from.coins < amount) {
      return {
        content: `น้อง ${Formatters.userMention(
          fromDiscordId
        )} มีแต้มบุญไม่พอ ยังจะโอนให้เพื่อนอีกเหรอ`,
      }
    }

    await this.campers.transferCoin(from.id, to.id, amount)
    return {
      content: `${Formatters.userMention(fromDiscordId)} โอนแต้มบุญให้ ${Formatters.userMention(
        toDiscordId
      )} ${amount} แต้ม`,
    }
  }

  private async steal(
    fromDiscordId: string,
    toDiscordId: string,
    from: Camper,
    to: Camper,
    amount: number
  ): Promise<InteractionReplyOptions> {
    const penalty = Math.round(STEAL_PENALTY_MULTIPLIER * amount)
    const maxAmount = Math.round(STEAL_MAX_FRACTION * to.coins)
    if (from.coins < penalty) {
      return {
        content: `น้อง ${Formatters.userMention(
          fromDiscordId
        )} พยายามจะขโมยแต้มบุญเพื่อน แต่ไม่ได้เตรียมแต้มบุญไว้วางแผนขโมย`,
      }
    }

    const success = Math.random() < STEAL_SUCCESS_RATE
    if (success) {
      const stealAmount = Math.min(amount, maxAmount)
      await this.campers.transferCoin(to.id, from.id, stealAmount)
      return {
        content: `${Formatters.userMention(fromDiscordId)} ขโมยแต้มบุญจาก ${Formatters.userMention(
          toDiscordId
        )} มาได้ ${stealAmount} แต้ม`,
      }
    } else {
      await this.campers.transferCoin(from.id, to.id, penalty)
      return {
        content: `${Formatters.userMention(fromDiscordId)} ขโมยแต้มบุญจาก ${Formatters.userMention(
          toDiscordId
        )} ไม่สำเร็จ ต้องเสียแต้มบุญ ${penalty} แต้มเป็นค่าทำขวัญ`,
      }
    }
  }
}
