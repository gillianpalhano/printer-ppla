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
    const maximumLength = this.getTotalWidth().toString().padStart(4, '0')
    dataBuffer = Buffer.concat([dataBuffer, Buffer.from(`\x02M${maximumLength}\r`)])
  }

  dataBuffer = Buffer.concat([dataBuffer, Buffer.from(`\x02KI7${this.config.transferType}\r`)])
  dataBuffer = Buffer.concat([dataBuffer, Buffer.from(`\x02O${this.config.startposition!.toString().padStart(4, '0')}\r`)])
  dataBuffer = Buffer.concat([dataBuffer, Buffer.from(`\x02V${this.config.cutterDispenserConfig}\r`)])
  dataBuffer = Buffer.concat([dataBuffer, Buffer.from(`\x02f${this.config.stopPosition!.toString().padStart(3, '0')}\r`)])
  dataBuffer = Buffer.concat([dataBuffer, Buffer.from(`\x02c${this.config.continuousLength!.toString().padStart(4, '0')}\r`)])
    
  if(this.preCommand.length > 0) {
    const pre = Buffer.concat(this.preCommand.map((c) => Buffer.isBuffer(c) ? c : Buffer.from(c)))
    dataBuffer = Buffer.concat([dataBuffer, pre])
  }

  if(this.command.length > 0) {
    const command = Buffer.concat(this.command.map((c) => Buffer.isBuffer(c) ? c : Buffer.from(c)))
    dataBuffer = Buffer.concat([
      dataBuffer,
      Buffer.from('\x02L\r'),
      Buffer.from(`D${this.config.pixelSizeW}${this.config.pixelSizeH}\r`),
      Buffer.from(`H${this.config.heatValue!.toString().padStart(2, '0')}\r`),
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