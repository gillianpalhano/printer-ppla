import { Printer } from '..'
import { TMemories } from '../index.type'

/**
 * Function clearMemory
 * ---
 * Clear selected memory
 * @param memory - Memory to be cleared (use import { Memory } from ...)
 */
export function clearMemory(this: Printer, memory: TMemories = this.config.defaultSaveGraphic!) {
  if(!['A', 'B', 'C'].includes(memory)) throw new Error('Error value memory')
  this.preCommand.push(`\x02q${memory}`)
  return this
}

/**
 * Function clearAllMemory
 * ---
 * Clear both memories
 */
export function clearAllMemory(this: Printer) {
  this.preCommand.push(`\x02Q`)
  return this
}