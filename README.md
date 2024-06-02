
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

## Functions

| **Function**   | **Type** | **Example**       |
| :---------- | :--------- | :--------- |
| setConfig | IConfig | ```.setConfig(myConfig: IConfig)``` |
| setCopies | number | ```.setCopies(2)``` |
| addBarcode | IBarcode| ```.addBarcode({ y: 10, x: 10, data: '123456', type: 'A' })``` |
| addBox | IBox | ```.addBox({ y: 10, x: 10, a: 100, b: 150, s: 10, t: 10 })``` |
| addLine | ILine | ```.addLine({ y: 10, x: 10, a: 100, b: 150 })``` |
| addText | IText | ```.addText({ y: 10, x: 10, text: 'My first test!' })``` |
| clearMemory | string | ```.clearMemory(Memory.RAM)``` |
| clearAllMemory | -- | ```.clearAllMemory()``` |
| sendGraphic | IsendGraphic | ```.sendGraphic()``` *see details below |
| addGraphic | IGraphic | ```.addGraphic()``` *see details below |
| deleteGraphic | IDeleteGraphic | ```.deleteGraphic()``` *see details below |
| build | | ```.build()``` *see details below |
| send | | ```.send()``` *see details below |
| getCode | | ```.getCode``` *see details below |


### Functions graphic
```typescript
// Loads the monochrome .bmp image into memory
const fileBuffer  = fs.readFileSync(bmpFilePath);

// Sends the image to the printer's memory
print.sendGraphic({ imageBuffer: fileBuffer, name: 'myimage' })

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