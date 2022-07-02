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
import {
  Formatters,
  InteractionReplyOptions,
  Message,
  MessageOptions,
  MessagePayload,
} from 'discord.js'
import { CamperRepository } from 'src/camper/camper.repository'
import {
  GiveCoinUpdateMeta,
  GiveStealPenaltyCoinUpdateMeta,
  GivenCoinUpdateMeta,
  GivenStealPenaltyCoinUpdateMeta,
  StealCoinUpdateMeta,
  StolenCoinUpdateMeta,
} from 'src/camper/coin-update-meta'
import { NotRegisteredError } from 'src/discord-bot/errors'

import { CommandErrorFilter } from '../error-filter'
import { GiveDTO } from './give.dto'

const STEAL_SUCCESS_RATE = 0.35
const STEAL_PENALTY_MULTIPLIER = 1.5
const STEAL_MAX_FRACTION = 0.2
const STEAL_COUNT_TO_WARN = 5

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
      return await this.steal(
        interaction.user.id,
        dto.to,
        from,
        to,
        -dto.amount,
        interaction.channel.send
      )
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
        )} มีแต้มบุญไม่พอ ยังจะโอนให้เพื่อนอีกเหรอ 👀`,
      }
    }

    const fromMeta: GiveCoinUpdateMeta = {
      type: 'give',
      giveToId: to.id,
    }
    const toMeta: GivenCoinUpdateMeta = {
      type: 'given',
      givenById: from.id,
    }
    await this.campers.transferCoin(from.id, to.id, fromMeta, toMeta, amount)
    return {
      content: `${Formatters.userMention(fromDiscordId)} โอนแต้มบุญให้ ${Formatters.userMention(
        toDiscordId
      )} ${amount} แต้มบุญ 🙏`,
    }
  }

  private async steal(
    fromDiscordId: string,
    toDiscordId: string,
    from: Camper,
    to: Camper,
    amount: number,
    sendToChannel: (options: string | MessagePayload | MessageOptions) => Promise<Message<boolean>>
  ): Promise<InteractionReplyOptions> {
    const penalty = Math.round(STEAL_PENALTY_MULTIPLIER * amount)
    const maxAmount = Math.round(STEAL_MAX_FRACTION * to.coins)
    if (from.coins < penalty) {
      return {
        content: `น้อง ${Formatters.userMention(
          fromDiscordId
        )} พยายามจะขโมยแต้มบุญเพื่อน แต่เตรียมแต้มบุญไว้ไม่พอวางแผนขโมย`,
      }
    }

    const success = Math.random() < STEAL_SUCCESS_RATE
    if (success) {
      const stealAmount = Math.min(amount, maxAmount)
      const fromMeta: StealCoinUpdateMeta = {
        type: 'steal',
        stealFromId: to.id,
      }
      const toMeta: StolenCoinUpdateMeta = {
        type: 'stolen',
        stolenById: from.id,
      }
      await this.campers.transferCoin(to.id, from.id, toMeta, fromMeta, stealAmount)
      const stealCount = await this.campers.getStealCount(fromDiscordId)

      if (stealCount % STEAL_COUNT_TO_WARN === 0) {
        await sendToChannel(
          `เตือนภัย❗️ ${Formatters.userMention(
            fromDiscordId
          )} ขโมยเป็ยรอบที่ ${stealCount} แล้ว 😡`
        )
      }
      return {
        content: `${Formatters.userMention(fromDiscordId)} ขโมยแต้มบุญจาก ${Formatters.userMention(
          toDiscordId
        )} มาได้ ${stealAmount} แต้มบุญ 💰`,
      }
    } else {
      const fromMeta: GiveStealPenaltyCoinUpdateMeta = {
        type: 'give-steal-penalty',
        giveToId: to.id,
      }
      const toMeta: GivenStealPenaltyCoinUpdateMeta = {
        type: 'given-steal-penalty',
        givenById: from.id,
      }
      await this.campers.transferCoin(from.id, to.id, fromMeta, toMeta, penalty)
      return {
        content: `${Formatters.userMention(fromDiscordId)} ขโมยแต้มบุญจาก ${Formatters.userMention(
          toDiscordId
        )} ไม่สำเร็จ ต้องเสีย ${penalty} แต้มบุญเป็นค่าทำขวัญ 👻`,
      }
    }
  }
}
