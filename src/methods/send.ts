import { Printer } from '..'

/**
 * Function send
 * ---
 * Send to printer
 * 
 * Note: The function to be used is configured at class initialization or in setConfig (param config.printFunction)
 */
export function send(this: Printer) {
  if (!this.config.printFunction) throw new Error('Function not configured!')

  const dataBuffer = this.build()
  this.config.printFunction(dataBuffer)
}