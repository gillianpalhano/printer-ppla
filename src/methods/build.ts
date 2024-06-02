import { Printer } from '..'

/**
 * Function build
 * ---
 * Return the code in Buffer
 * @param copies - number of copies
 * @returns Buffer 
 */
export function build(this: Printer, copies?: number): Buffer {
  copies = copies && copies > 0 ? copies : this.copies
  let dataBuffer = Buffer.from('')
  if(this.command.length > 0) {
    dataBuffer = Buffer.concat([dataBuffer, Buffer.from(`\x02${this.config.unitMeasurement}\r`)])
  }
  
  if(this.config.setMaximumLength && this.command.length > 0) {
    const maximumLength = (this.config.width! * this.config.columns!).toString().padStart(4, '0')
    dataBuffer = Buffer.concat([dataBuffer, Buffer.from(`M${maximumLength}\r`)])
  }
    
  if(this.preCommand.length > 0) {
    const pre = Buffer.concat(this.preCommand.map((c) => Buffer.isBuffer(c) ? c : Buffer.from(c)))
    dataBuffer = Buffer.concat([dataBuffer, pre])
  }

  if(this.command.length > 0) {
    const command = Buffer.concat(this.command.map((c) => Buffer.isBuffer(c) ? c : Buffer.from(c)))
    dataBuffer = Buffer.concat([
      dataBuffer,
      Buffer.from('\x02L\r'),
      command,
      Buffer.from(`Q${copies.toString().padStart(4, '0')}\r`),
      Buffer.from('E\r'),
    ])
  }

  if(this.postCommand.length > 0) {
    const post = Buffer.concat(this.postCommand.map((c) => Buffer.isBuffer(c) ? c : Buffer.from(c)))
    dataBuffer = Buffer.concat([dataBuffer, post])
  }
  return dataBuffer
}