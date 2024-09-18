import { Printer } from '..'

/**
 * Function setCopies
 * ---
 * Set the number of copies
 * 
 * Command: Qnnnn,.,
 * 
 * Note: Can be added directly to the build function or getCode function
 * @param copies - number of copies
 */
export function setCopies(this: Printer, copies: number) {
  this.copies = copies
  return this
}
