import { Printer } from '..'
import { Direction } from '../constants'
import { ILine } from '../index.type'

/**
 * Function addLine
 * ---
 * Add a line into the label
 * 
 * Format: RX11000yyyyxxxxlaaaabbbb
 * @param y - A value for Y coordinate. The lower left corner is the origin point of the XY coordinate system. The Y value is the vertical offset from origin point. 
 * @param x - A value for X coordinate. The lower left corner is the origin of the XY coordinate system. The X value is the horizontal offset from origin point. 
 * @param a - A value that specifies the width of line.
 * @param b - A value that specifies the height of line. 
 * @param direction - print direction (import { Direction } ...)
 */
export function addLine(this: Printer, { y, x, a, b, direction = Direction.PORTRAIT, repeatColumns = false }: ILine) {

  const ys = y.toString().padStart(4, '0')
  const as = a.toString().padStart(4, '0')
  const bs = b.toString().padStart(4, '0')
  const repeat = repeatColumns ? this.config.columns! : 1
  const offsets = this.getOffsets()
  
  for(let i = 0; i < repeat; i++) {
    const xs = (x + offsets[i]).toString().padStart(4, '0')
    this.command.push(`${direction}X11000${ys}${xs}l${as}${bs}\r`)
  }

  return this
}