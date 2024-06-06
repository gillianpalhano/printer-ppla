import { Printer, IConfig, Memory } from '..'

/**
 * Function setConfig
 * ---
 * change config
 * 
 */
export function setConfig(this: Printer, config: IConfig) {
  if (config.width !== undefined && (typeof config.width !== 'number' || config.width <= 0) ) throw new Error('Error on width value')
  if (config.height !== undefined && (typeof config.height !== 'number' || config.height <= 0) ) throw new Error('Error on height value')
  if (config.columns !== undefined && (typeof config.columns !== 'number' || config.columns <= 0) ) throw new Error('Error on columns value')
  if (config.marginLeft !== undefined && (typeof config.marginLeft !== 'number' || config.marginLeft < 0) ) throw new Error('Error on marginLeft value')
  if (config.marginRight !== undefined && (typeof config.marginRight !== 'number' || config.marginRight < 0) ) throw new Error('Error on marginRight value')
  if (config.spaceBetween !== undefined && (typeof config.spaceBetween !== 'number' || config.spaceBetween < 0) ) throw new Error('Error on spaceBetween value')
  
  if (config.pixelSizeW !== undefined && (typeof config.pixelSizeW !== 'string' || config.pixelSizeW.length !== 1) ) throw new Error('Error on pixelSizeW value')
  if (config.pixelSizeH !== undefined && (typeof config.pixelSizeH !== 'string' || config.pixelSizeH.length !== 1) ) throw new Error('Error on pixelSizeH value')
  if (config.defaultSaveGraphic !== undefined && !['A', 'B', 'C'].includes(config.defaultSaveGraphic)) throw new Error('Error on defaultSaveGraphic value')

  if (config.unitMeasurement !== undefined && !['m', 'n'].includes(config.unitMeasurement) ) throw new Error('Error on unitMeasurement value')
  if (config.setMaximumLength !== undefined && typeof config.setMaximumLength !== 'boolean') throw new Error('Error on setMaximumLength value')



  this.config = Object.assign(this.config, config)
  return this
}