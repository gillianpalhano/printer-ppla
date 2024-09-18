import { Printer } from '..'
import { Direction } from '../constants'
import { IBarcode } from '../index.type'

/**
 * Function addBarcode
 * ---
 * Add a barcode into the label
 * 
 * Format: Rthvoooyyyyxxxx[data string]
 * @param y - A value for Y coordinate. The lower left corner is the origin point of the XY coordinate system. The Y value is the vertical offset from origin point. 
 * @param x - A value for X coordinate. The lower left corner is the origin of the XY coordinate system. The X value is the horizontal offset from origin point. 
 * @param data - A string of data with maximum 255 characters in length. The length of the string may be varied from the type of the bar code. 
 * @param wideBarWidth - '0' through '9' and 'A' through 'O' represent the width of wide bar. ('A'=10,'B'=11, .. and 'O'=24)
 * @param narrowBarWidth - '0' through '9' and 'A' through 'O' represent the width of narrow bar. ('A'=10,'B'=11, .. and 'O'=24)
 * @param height - A value that represents the bar code height. 
 * @param direction - print direction (import { Direction } ...)
 * @param type - Bar code type. The range can be 'A' through 'T' and 'a' through 'z', each character represents a bar code type and rule.
 */
export function addBarcode(
    this: Printer,
    { y, x, data, wideBarWidth = '1', narrowBarWidth = '0', height = 0, direction = Direction.PORTRAIT, type = 'A', repeatColumns = false}: IBarcode
  ) {
  const heights = height.toString().padStart(3, '0')
  const ys = y.toString().padStart(4, '0')
  const repeat = repeatColumns ? this.config.columns! : 1
  const offsets = this.getOffsets()
  
  for(let i = 0; i < repeat; i++) {
    const xs = (x + offsets[i]).toString().padStart(4, '0')
    this.command.push(`${direction}${type}${wideBarWidth}${narrowBarWidth}${heights}${ys}${xs}${data}\r`)
  }

  return this
}