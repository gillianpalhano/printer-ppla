import { Printer, notationToHexReplace } from '..'

function insertCR(input: string): string {
  if (!input.endsWith('<CR>') && !input.endsWith('\r') && !input.endsWith('\r\n') && !input.endsWith('\n\r')) {
    return input + '<CR>'
  }
  return input;
}

/**
 * Function addPreCommand
 * ---
 * Enter commands at the beginning, can be used to change printer settings (system command, interactions or others)
 * * see addCommand
 * * see addPostCommand
 * @param command - A raw command. 
 * @example print.addPreCommand('<STX>O220<CR>')
 */
export function addPreCommand(this: Printer, command: string): Printer {
  this.preCommand.push(notationToHexReplace(insertCR(command)))

  return this
}

/**
 * Function addCommand
 * ---
 * Enter commands to edit the label
 * * see addPreCommand
 * * see addPostCommand
 * @param command - A raw command. 
 * @example print.addCommand('121100000500050Test<CR>')
 */
export function addCommand(this: Printer, command: string): Printer {
  this.command.push(notationToHexReplace(insertCR(command)))

  return this
}

/**
 * Function addPostCommand
 * ---
 * Insert commands after label editing commands
 * * see addPreCommand
 * * see addCommand
 * @param command - A raw command. 
 * @example print.addPostCommand('<STX>xAGmyimage<CR>')
 */
export function addPostCommand(this: Printer, command: string): Printer {
  this.postCommand.push(notationToHexReplace(insertCR(command)))

  return this
}