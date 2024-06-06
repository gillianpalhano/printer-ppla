/**
 * ASCII Notation to HEX values
 * ---
 * @value SOH - '\x01' - interaction commands
 * @value STX - '\x02' - system commands
 * @value ACK - '\x06' - acknowledge
 * @value LF - '\x0A' - line feed
 * @value CR - '\x0D' - carriage return
 * @value XON - '\x11' - XON code for communication
 * @value XOFF - '\x13' - XOFF code for communication
 * @value NAK - '\x15' - not acknowledge
 * @value ESC - '\x1B' - font downloading commands
 */
export const notationToHex: { [key: string]: string } = {
  '<SOH>': '\x01', // interaction commands
  '<STX>': '\x02', // system commands
  '<ACK>': '\x06', // acknowledge
  '<LF>': '\x0A', // line feed
  '<CR>': '\x0D', // carriage return
  '<XON>': '\x11', // XON code for communication
  '<XOFF>': '\x13', // XOFF code for communication
  '<NAK>': '\x15', // not acknowledge
  '<ESC>': '\x1B', // font downloading commands
}