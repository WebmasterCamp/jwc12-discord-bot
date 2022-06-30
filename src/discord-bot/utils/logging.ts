import { Interaction, TextChannel } from 'discord.js'
import { PrismaService } from 'src/prisma.service'

export async function notifyLogging(
  prisma: PrismaService,
  interaction: Interaction,
  message: string
): Promise<void> {
  const metadata = await prisma.guildMetadata.findUnique({
    where: { guildId: interaction.guildId },
  })

  if (!metadata?.loggingChannel) return

  const guild = await interaction.guild.fetch()
  const loggingChannel = guild.channels.cache.get(metadata.loggingChannel) as TextChannel
  await loggingChannel.send(message)
}
