import { ApplicationCommand, CommandInteractionOptionResolver, Formatters } from 'discord.js'

type Options = Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>

export function formatCommandOptions(command: ApplicationCommand, options: Options) {
  const optionItems = command.options.map(
    (option) => `${Formatters.inlineCode(`${option.name}:${options.getString(option.name)}`)}`
  )
  return optionItems.join(' ')
}
