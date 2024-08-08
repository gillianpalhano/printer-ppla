import * as fs from 'fs'
import { IBMP, IBMPHeader, IDIBHeader, IResize, Pixel } from '..'

function readBMP(filePath: string): Buffer {
  const buffer = fs.readFileSync(filePath)

  return buffer
}

function decodeBMP(buffer: Buffer): IBMP {
  // Ler o cabeçalho do arquivo BMP
  const bmpHeader: IBMPHeader = {
    fileType: buffer.toString('utf-8', 0, 2),
    fileSize: buffer.readUInt32LE(2),
    reserved1: buffer.readUInt16LE(6),
    reserved2: buffer.readUInt16LE(8),
    offset: buffer.readUInt32LE(10),
  }

  // Verificar se é um arquivo BMP válido
  if (bmpHeader.fileType !== 'BM') {
    throw new Error('Not a valid BMP file')
  }

  // Ler o cabeçalho DIB (Bitmap Information Header)
  const dibHeader: IDIBHeader = {
    headerSize: buffer.readUInt32LE(14),
    width: buffer.readInt32LE(18),
    height: buffer.readInt32LE(22),
    planes: buffer.readUInt16LE(26),
    bitCount: buffer.readUInt16LE(28),
    compression: buffer.readUInt32LE(30),
    imageSize: buffer.readUInt32LE(34),
    xPixelsPerMeter: buffer.readInt32LE(38),
    yPixelsPerMeter: buffer.readInt32LE(42),
    colorsUsed: buffer.readUInt32LE(46),
    importantColors: buffer.readUInt32LE(50),
  }

  if (dibHeader.bitCount !== 1) {
    throw new Error('Not a monochrome BMP file')
  }

  return {
    buffer,
    bmpHeader,
    dibHeader
  }
}

function bufferToBinMatrix(bmp: IBMP): Pixel[][] {
  const rowSize = Math.ceil(bmp.dibHeader.width / 8)
  const padding = (4 - (rowSize % 4)) % 4

  const pixels: Pixel[][] = []
  let offset = bmp.bmpHeader.offset

  for (let y = 0; y < bmp.dibHeader.height; y++) {
    const row: Pixel[] = []
    for (let x = 0; x < rowSize; x++) {
      const byte = bmp.buffer.readUInt8(offset++)
      for (let bit = 0; bit < 8; bit++) {
        if (x * 8 + bit < bmp.dibHeader.width) {
          const pixel = (byte >> (7 - bit)) & 1
          row.push(pixel as Pixel)
        }
      }
    }
    offset += padding
    // pixels.unshift(row)
    pixels.push(row)
  }

  return pixels
}

function resizeBinMatrix(binMatrix: Pixel[][], newWidth: number, newHeight: number) {
  const oldWidth = binMatrix[0].length
  const oldHeight = binMatrix.length
  const resizedMatrix = Array.from({ length: newHeight }, () => Array(newWidth).fill(0))

  for (let y = 0; y < newHeight; y++) {
    for (let x = 0; x < newWidth; x++) {
      const oldX = Math.floor(x * oldWidth / newWidth)
      const oldY = Math.floor(y * oldHeight / newHeight)
      resizedMatrix[y][x] = binMatrix[oldY][oldX]
    }
  }

  return resizedMatrix
}

function binMatrixToBuffer(binMatrix: Pixel[][]): Buffer {
  const rowSize = Math.ceil(binMatrix[0].length / 8)
  const paddedRowSize = Math.ceil(rowSize / 4) * 4 // Arredonda para o próximo múltiplo de 4 bytes
  const buffer = Buffer.alloc(binMatrix.length * paddedRowSize)
  let bufferIndex = 0

  for (let row of binMatrix) {
    let binStr = ''
    for (let bit of row) {
      binStr += bit
      if (binStr.length === 8) {
        buffer[bufferIndex++] = parseInt(binStr, 2)
        binStr = ''
      }
    }

    if (binStr.length > 0) {
      buffer[bufferIndex++] = parseInt(binStr.padEnd(8, '0'), 2)
    }

    // Adicionar bits de preenchimento para garantir que a linha tenha um comprimento múltiplo de 4 bytes
    while (bufferIndex % 4 !== 0) {
      buffer[bufferIndex++] = 0
    }
  }

  return buffer
}

function createBMPBuffer(data: Buffer, width: number, height: number): Buffer {
  const fileHeaderSize = 14
  const dibHeaderSize = 40
  const colorTableSize = 8
  const fileSize = fileHeaderSize + dibHeaderSize + colorTableSize + data.length

  const buffer = Buffer.alloc(fileSize)

  // Cabeçalho do Arquivo BMP
  buffer.write('BM', 0, 2, 'ascii')               // File type
  buffer.writeUInt32LE(fileSize, 2)               // File size
  buffer.writeUInt16LE(0, 6)                      // Reserved 1
  buffer.writeUInt16LE(0, 8)                      // Reserved 2
  buffer.writeUInt32LE(fileHeaderSize + dibHeaderSize + colorTableSize, 10) // Offset to pixel data

  // Cabeçalho DIB (BITMAPINFOHEADER)
  buffer.writeUInt32LE(dibHeaderSize, 14)         // Header size
  buffer.writeInt32LE(width, 18)                  // Image width
  buffer.writeInt32LE(height, 22)                 // Image height
  buffer.writeUInt16LE(1, 26)                     // Planes
  buffer.writeUInt16LE(1, 28)                     // Bit count
  buffer.writeUInt32LE(0, 30)                     // Compression
  buffer.writeUInt32LE(data.length, 34)           // Image size
  buffer.writeInt32LE(0, 38)                      // X pixels per meter
  buffer.writeInt32LE(0, 42)                      // Y pixels per meter
  buffer.writeUInt32LE(0, 46)                     // Colors used
  buffer.writeUInt32LE(0, 50)                     // Important colors

  // Paleta de Cores (Color Table)
  buffer.writeUInt32LE(0x00000000, 54)            // Color 0: Black (BGRA)
  buffer.writeUInt32LE(0x00FFFFFF, 58)            // Color 1: White (BGRA)

  data.copy(buffer, 62)

  return buffer
}

function resize(bmp: IBMP, { newWidth, newHeight, proportionalScale = true }: IResize): Buffer {
  if(newWidth == undefined && !proportionalScale) {
    newWidth = bmp.dibHeader.width
  } else if(newWidth == undefined) {
    newWidth = (newHeight! / bmp.dibHeader.height) * bmp.dibHeader.width
  } else if(newHeight == undefined && !proportionalScale) {
    newHeight = bmp.dibHeader.height
  } else if(newHeight == undefined) {
    newHeight = (newWidth! / bmp.dibHeader.width) * bmp.dibHeader.height
  }
  newWidth = Math.round(newWidth)
  newHeight = Math.round(newHeight!)

  const matrix = bufferToBinMatrix(bmp)
  const resized = resizeBinMatrix(matrix, newWidth!, newHeight!)
  const bufferData = binMatrixToBuffer(resized)
  const newBuffer = createBMPBuffer(bufferData, newWidth!, newHeight!)

  return newBuffer
}

/**
 * Function resizeBMP
 * ----
 * Function to resize the monochrome bitmap image (independent of the Printer class)
 * @param inputPath - image path 
 * @param newWidth - New width value
 * @param newHeight - New height value
 * @param proportionalScale - If only one value is provided for resizing, the other will be proportional (default true)
 * @returns Buffer of the image
 */
export function resizeBMP(inputPath: string, { newWidth, newHeight, proportionalScale = true }: IResize): Buffer {
  if (!inputPath) throw new Error('The input file path is required.')
  if (!newWidth && !newHeight) throw new Error('At least one dimension (width or height) must be provided.')

  const bmp = decodeBMP(readBMP(inputPath))

  return resize(bmp, { newWidth, newHeight, proportionalScale })
}

/**
 * Function resizeBufferBMP
 * ----
 * Function to resize the monochrome bitmap image (independent of the Printer class)
 * @param imgBuffer - Buffer of the image
 * @param newWidth - New width value
 * @param newHeight - New height value
 * @param proportionalScale - If only one value is provided for resizing, the other will be proportional (default true)
 * @returns Buffer of the image
 */
export function resizeBufferBMP(imgBuffer: Buffer, { newWidth, newHeight, proportionalScale = true }: IResize): Buffer {
  if (!imgBuffer) throw new Error('The buffer is required.')
  if (!newWidth && !newHeight) throw new Error('At least one dimension (width or height) must be provided.')

  const bmp = decodeBMP(imgBuffer)

  return resize(bmp, { newWidth, newHeight, proportionalScale })
}

/**
 * Function imageDataToMonochrome
 * ----
 * @param imageData - from html canvas
 * @param threshold - adjust threshold for pixel white and black
 * @returns matrix of pixels
 */
function imageDataToMonochrome(imageData: ImageData, threshold: number = 128): Pixel[][] {
  const { width, height, data } = imageData;
  const matrix: Pixel[][] = [];

  for (let y = height-1; y >= 0; y--) {
    const row: Pixel[] = [];
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const alpha = data[index + 3]/255;

      // Fundo branco
      const backgroundRed = 255;
      const backgroundGreen = 255;
      const backgroundBlue = 255;

      // Calcula a cor resultante com base na transparência
      const finalRed = red * alpha + backgroundRed * (1 - alpha);
      const finalGreen = green * alpha + backgroundGreen * (1 - alpha);
      const finalBlue = blue * alpha + backgroundBlue * (1 - alpha);

      // Calcula a luminância da cor resultante
      const luminance = 0.299 * finalRed + 0.587 * finalGreen + 0.114 * finalBlue;

      // Aplica o limiar para determinar se o pixel será preto ou branco
      row.push(luminance >= threshold ? 1 : 0);
    }
    matrix.push(row);
  }

  return matrix;
}

/**
 * Function imageDataToBMPBuffer
 * ----
 * @param imageData - from html canvas
 * @param threshold - adjust threshold for pixel white and black
 * @returns Buffer of the image
 */
export function imageDataToBMPBuffer(imageData: ImageData, threshold: number = 128): Buffer {
  const matrix = imageDataToMonochrome(imageData, threshold)
  const toBuffer = binMatrixToBuffer(matrix)
  const imgBuffer = createBMPBuffer(toBuffer, imageData.width, imageData.height)

  return imgBuffer
}
/**
 * Function cropTopWhiteLines
 * ---
 * Remove white lines from the top of the image
 * @param imgBuffer - Buffer of the image
 * @returns Buffer of the image
 */
export function cropTopWhiteLines(imgBuffer: Buffer): Buffer {
  const bmp = decodeBMP(imgBuffer)
  const matrix = bufferToBinMatrix(bmp)

  let croppedMatrix = [...matrix]; // Cópia da matriz original

  for (let i = croppedMatrix.length-1; i >=0; i--) {
      // Verifica se a linha atual é toda branca (assumindo que '1' representa branco)
      const isWhite = croppedMatrix[i].every(pixel => pixel === 1);
      if (!isWhite) {
          croppedMatrix = croppedMatrix.slice(0, i); // Remove as linhas superiores
          break;
      }
  }

  const bufferData = binMatrixToBuffer(croppedMatrix)
  const newBuffer = createBMPBuffer(bufferData, bmp.dibHeader.width, croppedMatrix.length)

  return newBuffer
}