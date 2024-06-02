import { Printer, IConfig } from '..'

/**
 * Function setConfig
 * ---
 * change config
 * 
 */
export function setConfig(this: Printer, config: IConfig) {
  this.config = Object.assign(this.config, config)
  return this
}