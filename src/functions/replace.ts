import { notationToHex } from '..'

export function notationToHexReplace(input: string): string {
  const notationRegex = new RegExp(Object.keys(notationToHex).join('|'), 'g')
  return input.replace(notationRegex, match => notationToHex[match])
}
