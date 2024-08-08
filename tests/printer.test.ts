import { describe, it, expect } from 'vitest'
import { Memory, Printer, resizeBMP } from '../src'
import * as fs from 'fs'

describe('Printer', () => {
  it('header default', () => {
    const printer = new Printer({})
    const substrings = [
      '<STX>KI71<CR>',
      '<STX>O0220<CR>',
      '<STX>V0<CR>',
      '<STX>f298<CR>',
      '<STX>c0000<CR>'
    ]
    substrings.forEach(substring => {
      expect(printer.getCode()).toContain(substring);
    })
  })

  it('addBarcode', () => {
    const printer = new Printer({}).addBarcode({ y: 10, x: 10, data: '123456', type: 'A' })
    expect(printer.getCode()).toContain('1A1000000100010123456<CR>')
  })

  it('addBox', () => {
    const printer = new Printer({}).addBox({ y: 10, x: 10, a: 100, b: 150, s: 10, t: 10 })
    expect(printer.getCode()).toContain('1X1100000100010b0100015000100010<CR>')
  })

  it('addLine', () => {
    const printer = new Printer({}).addLine({ y: 10, x: 10, a: 100, b: 150 })
    expect(printer.getCode()).toContain('1X1100000100010l01000150<CR>')
  })

  it('addText', () => {
    const printer = new Printer({}).addText({ y: 10, x: 10, text: 'My first test!' })
    expect(printer.getCode()).toContain('121100000100010My first test!<CR>')
  })

  it('clearMemory', () => {
    const printer = new Printer({}).clearMemory(Memory.RAM)
    expect(printer.getCode()).toContain('qA')
  })

  it('clearAllMemory', () => {
    const printer = new Printer({}).clearAllMemory()
    expect(printer.getCode()).toContain('Q')
  })

  it('sendGraphic', () => {
    const imageBuffer  = fs.readFileSync('./tests/img_test.bmp')
    const printer = new Printer({}).sendGraphic({ imageBuffer, name: 'myimage' })
    expect(printer.getCode()).toContain('<STX>ICCBmyimage<CR>')
  })

  it('addGraphic', () => {
    const printer = new Printer({}).addGraphic({ y: 50, x: 50, name: 'myimage', deleteAfter: false })
    expect(printer.getCode()).toContain('1Y1100000500050myimage<CR>')
  })

  it('deleteGraphic', () => {
    const printer = new Printer({}).deleteGraphic({ name: 'myimage' })
    expect(printer.getCode()).toContain('<STX>xCGmyimage<CR>')
  })

  it('addPreCommand', () => {
    const printer = new Printer({}).addPreCommand('<STX>M0550<CR>')
    expect(printer.getCode()).toContain('<STX>M0550<CR>')
  })

  it('addCommand', () => {
    const printer = new Printer({}).addCommand('A2')
    expect(printer.getCode()).toContain('A2')
  })

  it('addPostCommand', () => {
    const printer = new Printer({}).addPostCommand('<STX>xAGmyimagetest<CR>')
    expect(printer.getCode()).toContain('<STX>xAGmyimagetest<CR>')
  })

  it('build', () => {
    const printer = new Printer({})
    expect(Buffer.isBuffer(printer.build())).toBe(true)
  })

  it('resizeBMP', () => {
    const bmpFilePath = './tests/img_test.bmp'
    const imageBuffer = resizeBMP(bmpFilePath, { newWidth: 20 })

    expect(Buffer.isBuffer(imageBuffer)).toBe(true)

    const width = imageBuffer.readInt32LE(18);
    expect(width).toBe(20) // width 20
  })
})
