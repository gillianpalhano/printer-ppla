import { Printer } from '..'

/**
 * Function getCode
 * ---
 * Return the code in text format
 * @param copies - number of copies
 * @returns string 
 */
export function getCode(this: Printer, copies?: number): string {
  return this.build(copies)
            .toString('utf-8')
            .replace(/\x02/g, '<STX>')
            .replace(/\r/g, '\r\n')
            .replace(/\r/g, '<CR>')
}