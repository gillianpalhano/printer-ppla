import * as methods from './methods'
import { Memory } from './constants'
import { type IConfig } from './index.type'

export * from './index.type'
export * from './constants'
export * from './functions'

/**
 * Class Printer
 * ---
 * @example new Printer(config: IConfig).addText(...).build()
 * 
 * or 
 * @example const printer = new Printer(config: IConfig)
 * printer.addText(...).build()
 */
export class Printer {
  protected preCommand: (string | Buffer)[] = [];
  protected command: (string | Buffer)[] = [];
  protected postCommand: (string | Buffer)[] = [];
  protected copies = 1;

  protected config: IConfig = {
    width: 100,
    height: 100,
    columns: 1,
    marginLeft: 0,
    marginRight: 0,
    spaceBetween: 0,
    pixelSizeW: '2',
    pixelSizeH: '2',
    defaultSaveGraphic: Memory.DEFAULT, // A para RAM, B para flash
    unitMeasurement: 'm',
    setMaximumLength: true,
    printFunction: undefined,

    transferType: 1, // KI71 - Sets transfer type
    startposition: 220, // O0220 - Sets print start position
    cutterDispenserConfig: 0, // V0 - Sets cutter and dispenser configuration
    stopPosition: 298, // f298 - Sets stop position and automatic back-feed for the label stock
    continuousLength: 0, // c0000 -- Sets continuous label length
  }

  constructor(config: IConfig) {
    this.setConfig(config);
  }

  protected getTotalWidth(): number {
    return this.config.marginLeft! + this.config.width! * this.config.columns! + this.config.spaceBetween! * (this.config.columns! - 1) + this.config.marginRight!
  }
  public getOffsets(): number[] {
    const { columns, marginLeft, width, spaceBetween } = this.config
    const offsets = []
    for(let i = 0; i < columns!; i++) {
      const l = marginLeft! + width! * i + spaceBetween! * i
      offsets.push(l)
    }
    return offsets
  }

    

  public setConfig = methods.setConfig
  public setCopies = methods.setCopies
  public clearMemory = methods.clearMemory
  public clearAllMemory = methods.clearAllMemory

  public addPreCommand = methods.addPreCommand
  public addCommand = methods.addCommand
  public addPostCommand = methods.addPostCommand

  public addText = methods.addText
  public addBarcode = methods.addBarcode
  public addLine = methods.addLine
  public addBox = methods.addBox

  public sendGraphic = methods.sendGraphic
  public addGraphic = methods.addGraphic
  public deleteGraphic = methods.deleteGraphic

  public getCode = methods.getCode
  public build = methods.build
  public send = methods.send
}
