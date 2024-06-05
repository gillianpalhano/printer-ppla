import { Printer, IsendGraphic, IGraphic, IDeleteGraphic } from '..'

/**
 * Function sendGraphic
 * ---
 * Send the image to the printer (monochromatic .bmp)
 * @param imageBuffer - The Buffer of the image (8-bit BMP file format)
 * @param name - The name of the image (maximum 16 characters). The file name can be accessed with label formatting commands.
 * @param flipped - Boolean for whether the image will be flipped
 * @param memory - Memory location to be saved
 */
export function sendGraphic(this: Printer, { imageBuffer, name, flipped = true, memory = this.config.defaultSaveGraphic }: IsendGraphic) {
  if(name.length > 16) throw new Error('16 character name limit exceeded')
  if (imageBuffer.toString('ascii', 0, 2) !== 'BM') throw new Error('File is not a valid bmp')
  if (imageBuffer.readUInt16LE(28) !== 1) throw new Error('bmp is not monochromatic (1 bit per pixel)')
  
  const dataBuffer = Buffer.concat([
    Buffer.from(`\x02I${this.config.defaultSaveGraphic}${memory}${flipped ? 'B' : 'b'}${name}\r`),
    imageBuffer,
  ])

  this.preCommand.push(dataBuffer)
  return this
}

/**
 * Function addGraphic
 * ---
 * Add the image stored in memory
 * @param y - A value for Y coordinate. The lower left corner is the origin point of the XY coordinate system. The Y value is the vertical offset from origin point. 
 * @param x - A value for X coordinate. The lower left corner is the origin of the XY coordinate system. The X value is the horizontal offset from origin point. 
 * @param name - The name of the image that was downloaded (maximum 16 characters).
 * @param deleteAfter - Delete this image after use?
 * @param memory - Memory location where it was saved
 */
export function addGraphic(this: Printer, { y, x, name, deleteAfter = true, memory = this.config.defaultSaveGraphic }: IGraphic) { // 1Y11000yyyyxxxxn..n
  if(name.length > 16) throw new Error('16 character name limit exceeded')
  this.command.push(`1Y11000${y.toString().padStart(4, '0')}${x.toString().padStart(4, '0')}${name}\r`)
  if(deleteAfter) {
    this.deleteGraphic({ memory, name })
  }
  return this
}

/**
 * Function deleteGraphic
 * ---
 * Delete the image stored in memory
 * @param name - The name of the image that was downloaded (maximum 16 characters).
 * @param memory - Memory location where it was saved
 */
export function deleteGraphic(this: Printer, { name, memory = this.config.defaultSaveGraphic }: IDeleteGraphic) { // 1Y11000yyyyxxxxn..n
  if(name.length > 16) throw new Error('16 character name limit exceeded')

  this.postCommand.push(`\x02x${memory}G${name}\r`)
  return this
}