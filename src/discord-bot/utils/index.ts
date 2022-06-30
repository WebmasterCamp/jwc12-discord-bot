export function capitalize(str?: string) {
  if (!str) return ''
  const lower = str.toLowerCase()
  return str.charAt(0).toUpperCase() + lower.slice(1)
}
