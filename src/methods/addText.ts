import { Printer, Font, Direction, IText } from '..'

/**
 * Function addText
 * ---
 * Format: Rthvoooyyyyxxxx[data string]
 * @param y - A value for Y coordinate. The lower left corner is the origin point of the XY coordinate system. The Y value is the vertical offset from origin point. 
 * @param x - A value for X coordinate. The lower left corner is the origin of the XY coordinate system. The X value is the horizontal offset from origin point. 
 * @param text -  A string of printable data with maximum 255 characters in length.
 * @param font - Font type. (import { Font } ... and use Font[xxx].font)
 * @param subFont - subFont type. (import { Font } ... and use Font[xxx].subFont[zzz])
 * @param hScale - Horizontal scale. '0' through '9' and 'A' through 'O' represent the width of wide bar. ('A'=10,'B'=11, .. and 'O'=24)
 * @param vScale - Vertical scale. '0' through '9' and 'A' through 'O' represent the width of wide bar. ('A'=10,'B'=11, .. and 'O'=24)
 * @param direction - print direction (import { Direction } ...)
 */
export function addText(this: Printer, { y, x, text, font = '2', subFont = '000', hScale = '1', vScale = '1', direction = Direction.PORTRAIT }: IText) {
  if (!Font[font]) throw new Error('Error value font')
  if (!Font[font].subFont.includes(subFont) && font !== '9') throw new Error('Error value subFont')
  
  const ys = y.toString().padStart(4, '0')
  const xs = x.toString().padStart(4, '0')
  this.command.push(`${direction}${font}${hScale}${vScale}${subFont}${ys}${xs}${text}\r`)

  return this
}
