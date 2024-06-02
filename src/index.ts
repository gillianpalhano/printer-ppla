import * as methods from './methods'
import { Memory, Font } from './constants'
import { type IConfig } from './index.type'

export * from './index.type'
export * from './constants'

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
  }

  constructor(config: IConfig) {
    this.setConfig(config);
  }

    

  public setConfig = methods.setConfig
  public setCopies = methods.setCopies
  public clearMemory = methods.clearMemory
  public clearAllMemory = methods.clearAllMemory

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
