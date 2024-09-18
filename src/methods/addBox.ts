import { Printer } from '..'
import { Direction } from '../constants'
import { IBox } from '../index.type'


/**
 * Function addBox
 * ---
 * Add a box into the label 
 * 
 * Format: RX11000yyyyxxxxbaaaabbbbttttssss
 * @param y - A value for Y coordinate. The lower left corner is the origin point of the XY coordinate system. The Y value is the vertical offset from origin point. 
 * @param x - A value for X coordinate. The lower left corner is the origin of the XY coordinate system. The X value is the horizontal offset from origin point. 
 * @param a - A value that specifies the width of line.
 * @param b - A value that specifies the height of line.
 * @param t - A value that specifies the thickness of top and bottom box edges.
 * @param s - A value that specifies the thickness of side edges.
 * @param direction - print direction (import { Direction } ...)
 */
export function addBox(this: Printer, { y, x, a, b, t, s, direction = Direction.PORTRAIT, repeatColumns = false }: IBox) {

  const ys = y.toString().padStart(4, '0')
  const as = a.toString().padStart(4, '0')
  const bs = b.toString().padStart(4, '0')
  const ts = t.toString().padStart(4, '0')
  const ss = s.toString().padStart(4, '0')
  const repeat = repeatColumns ? this.config.columns! : 1
  const offsets = this.getOffsets()
  
  for(let i = 0; i < repeat; i++) {
    const xs = (x + offsets[i]).toString().padStart(4, '0')
    this.command.push(`${direction}X11000${ys}${xs}b${as}${bs}${ts}${ss}\r`)
  }

  return this
}