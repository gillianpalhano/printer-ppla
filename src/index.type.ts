/**
 * Interface IConfig
 * ------
 * @param width - width of label
 * @param height - height of label
 * @param columns - number of columns
 * @param marginLeft - margin left
 * @param marginRight - margin right
 * @param spaceBetween - space between each label
 * @param pixelSizeW - width pixel size - default: "2" (0.0049 inch / 0.125 mm for models OS214/OS204/204/X2000+/1000/G6000 and 0.0033 inch / 0.084 mm for models OS314/X3000+/G7000)
 * @param pixelSizeH - height pixel size - default: "2" (see pixelSizeW)
 * @param defaultSaveGraphic - default storage location (A for RAM, B for flash, C for configured default)
 * @param unitMeasurement - unit of measurement ("m" for metric or "n" for inch)
 * @param setMaximumLength - set maximum lenght of label? maximum is labels * number of labels + spaces
 * @param printFunction - function to send data to be printed
 */
export interface IConfig {
  width?: number
  height?: number
  columns?: number
  marginLeft?: number
  marginRight?: number
  spaceBetween?: number
  pixelSizeW?: '1' | '2' | '3'
  pixelSizeH?: '1' | '2' | '3'
  defaultSaveGraphic?: TMemories
  unitMeasurement?: 'm' | 'n'
  setMaximumLength?: boolean
  printFunction?: Function
}

export type TDirections = '1' | '2' | '3' | '4'
export type TMemories = 'A' | 'B' | 'C'
export type TMemoriesName = 'RAM' | 'FLASH' | 'DEFAULT'
export type TValues = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O'

export type TFont = {
  [key: string]: {
    font: string,
    subFont: string[]
  }
}

export interface IBarcode {
  y: number
  x: number
  data: string
  wideBarWidth?: TValues
  narrowBarWidth?: TValues
  height?: number
  direction?: TDirections
  type: string
}

export interface IBox {
  y: number
  x: number
  a: number
  b: number
  t: number
  s: number
  direction?: TDirections
}

export interface ILine {
  y: number
  x: number
  a: number
  b: number
  direction?: TDirections
}

export interface IText {
  y: number
  x: number
  text: string
  font?: string
  subFont?: string
  hScale?: TValues
  vScale?: TValues
  direction?: TDirections
}

export interface IsendGraphic {
  imageBuffer: Buffer
  name: string
  flipped?: boolean
  memory?: TMemories
}

export interface IGraphic {
  y: number
  x: number
  name: string
  deleteAfter?: boolean
  memory?: TMemories
}

export interface IDeleteGraphic {
  name: string
  memory?: TMemories
}
