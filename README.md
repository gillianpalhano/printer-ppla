
# Printer PPLA

The package for generating codes in the PPLA language used in Argox thermal printers.


## Installing

#### Using npm
```bash
  npm install printer-ppla
```
#### Using pnpm
```bash
  pnpm add printer-ppla
```
#### Using Yarn
```bash
  yarn add printer-ppla
```


## Using with typescript

``` typescript
import { Printer, type IConfig } from 'printer-ppla'

const configPrinter: IConfig = {
  width: 330,
  height: 550,
  columns: 3,
  unitMeasurement: 'm',
}

const print = new Printer(configPrinter)
print.addText({
  y: 100,
  x: 50,
  text: 'My first test!',
  direction: Direction.LANDSCAP
})
const printCode = print.build() // get the Buffer

const printCode = print.getCode() // get the code in string
```

## Config (IConfig)
##### 

| **Parameter** | **Function** |
| :---------- | :--------- |
| width | width of label |
| height | height of label |
| columns | number of columns |
| marginLeft | margin left |
| marginRight | margin right |
| spaceBetween | space between each label |
| pixelSizeW | width pixel size - default: "2" (0.0049 inch / 0.125 mm for models OS214/OS204/204/X2000+/1000/G6000 and 0.0033 inch / 0.084 mm for models OS314/X3000+/G7000) |
| pixelSizeH | height pixel size - default: "2" (see pixelSizeW) |
| defaultSaveGraphic | default storage location (A for RAM, B for flash, C for configured default) |
| unitMeasurement | unit of measurement ("m" for metric or "n" for inch) |
| maximumLength | set maximum lenght of label |
| printFunction | function to send data to be printed |
| transferType | Sets transfer type |
| startposition | Sets print start position |
| cutterDispenserConfig | Sets cutter and dispenser configuration |
| stopPosition | Sets stop position and automatic back-feed for the label stock |
| continuousLength | Sets continuous label length |
| heatValue | Sets heat value (2~20) |

## Methods

| **Methods**   | **Type** | **Example**       |
| :---------- | :--------- | :--------- |
| setConfig | IConfig | ```.setConfig(myConfig: IConfig)``` |
| setCopies | number | ```.setCopies(2)``` |
| addBarcode | IBarcode| ```.addBarcode({ y: 10, x: 10, data: '123456', type: 'A', repeatColumns: true })``` |
| addBox | IBox | ```.addBox({ y: 10, x: 10, a: 100, b: 150, s: 10, t: 10, repeatColumns: true })``` |
| addLine | ILine | ```.addLine({ y: 10, x: 10, a: 100, b: 150 })``` |
| addText | IText | ```.addText({ y: 10, x: 10, text: 'My first test!' })``` |
| clearMemory | string | ```.clearMemory(Memory.RAM)``` |
| clearAllMemory | -- | ```.clearAllMemory()``` |
| sendGraphic | IsendGraphic | ```.sendGraphic()``` *see details below |
| addGraphic | IGraphic | ```.addGraphic()``` *see details below |
| deleteGraphic | IDeleteGraphic | ```.deleteGraphic()``` *see details below |
| addPreCommand | string | ```.addPreCommand('<STX>M0550<CR>')``` |
| addCommand | string | ```.addCommand('A2')``` |
| addPostCommand | string | ```.addPostCommand('<STX>xAGmyimage<CR>')``` |
| build | | ```.build()``` *see details below, [here](#functions-graphic) |
| send | | ```.send()``` *see details below, [here](#functions-graphic) |
| getCode | | ```.getCode``` *see details below, [here](#functions-graphic) |

## Functions

| **Functions**   | **Type** | **Example**  | **return** |
| :---------- | :--------- | :--------- | :--------- |
| resizeBMP | string, IResize | ```const imgBuffer = resizeBMP(inputPath, { newWidth })``` | Buffer of image |
| notationToHexReplace | string | ```notationToHexReplace('<STX>123300002500050G<CR>')```| string |


### Functions graphic
```typescript
/*
Function to resize a monochrome bitmap, the printed size can be calculated (depends on the printer - check manual).
For OS-214 Plus with pixelSizeW = 2 (see configPrinter: IConfig) it is 0.250mm per pixel.
*/
const imageBuffer = resizeBMP(bmpFilePath, { newWidth: 50/0.250 }) // 50mm

// or

// Loads the monochrome .bmp image into memory directly from the file
const imageBuffer  = fs.readFileSync(bmpFilePath);

// Sends the image to the printer's memory
print.sendGraphic({ imageBuffer, name: 'myimage' })

// Insert the image into the label
print.addGraphic({ y: 50, x: 50, name: 'myimage' })

// Deletes the image from the printer's memory (optional)
print.deleteGraphic({ name: 'myimage' })
```

### Function getCode
```typescript
// This function returns the PPLA code in string format
print.getCode();

/* example:
<STX>L<CR>
D11<CR>
141100000800060Test<CR>
E<CR>
*/
```

### Function build
```typescript
// This function returns the PPLA code in Buffer format
print.build();
```

### Function send
```typescript

function MyFunctionToSend(dataBuffer: Buffer) {
  // send Buffer to printer
}

const configPrinter: IConfig = {
  width: 330,
  height: 550,
  columns: 3,
  unitMeasurement: 'm',
  printFunction: MyFunctionToSend,
}
const print = new Printer(configPrinter)

print.addText({ y: 10, x: 10, text: 'My first test!' })

// Will use the function to send the Buffer to the printer
print.send();
```