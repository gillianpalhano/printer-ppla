
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

## Config
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

| **Methods**  | **Description** | **Type** | **Params** | **Example**       |
| :---------- | :--------- | :--------- | :--------- | :--------- |
| setConfig | Change config |IConfig | [view here](#Config (IConfig)) |```.setConfig(myConfig: IConfig)``` |
| setCopies | Set the number of copies | number | |```.setCopies(2)``` |
| addBarcode | Add a barcode into the label | IBarcode| <pre>**y:** A value for Y coordinate. The lower left corner is the origin point of the XY coordinate system. The Y value is the vertical offset from origin point.<br>**x:** A value for X coordinate. The lower left corner is the origin of the XY coordinate system. The X value is the horizontal offset from origin point.<br>**data:** A string of data with maximum 255 characters in length. The length of the string may be varied from the type of the bar code. <br>**wideBarWidth:** '0' through '9' and 'A' through 'O' represent the width of wide bar. ('A'=10,'B'=11, .. and 'O'=24). <br>**narrowBarWidth:** '0' through '9' and 'A' through 'O' represent the width of narrow bar. ('A'=10,'B'=11, .. and 'O'=24). <br>**height:** A value that represents the bar code height. <br>**direction:** print direction (import { Direction } ...). <br>**type:** Bar code type. The range can be 'A' through 'T' and 'a' through 'z', each character represents a bar code type and rule.</pre> |```.addBarcode({ y: 10, x: 10, data: '123456', type: 'A', repeatColumns: true })``` |
| addBox | Add a box into the label | IBox | <pre>**y:** A value for Y coordinate. The lower left corner is the origin point of the XY coordinate system. The Y value is the vertical offset from origin point. <br>**x:** A value for X coordinate. The lower left corner is the origin of the XY coordinate system. The X value is the horizontal offset from origin point. <br>**a:** A value that specifies the width of line.<br>**b:** A value that specifies the height of line.<br>**t:** A value that specifies the thickness of top and bottom box edges.<br>**s:** A value that specifies the thickness of side edges.<br>**direction:** print direction (import { Direction } ...)<pre> |```.addBox({ y: 10, x: 10, a: 100, b: 150, s: 10, t: 10, repeatColumns: true })``` |
| addLine | Add a line into the label | ILine | <pre>**y:** A value for Y coordinate. The lower left corner is the origin point of the XY coordinate system. The Y value is the vertical offset from origin point. <br>**x:** A value for X coordinate. The lower left corner is the origin of the XY coordinate system. The X value is the horizontal offset from origin point. <br>**a:** A value that specifies the width of line.<br>**b:** A value that specifies the height of line.<br>**direction:** print direction (import { Direction } ...)<pre> |```.addLine({ y: 10, x: 10, a: 100, b: 150 })``` |
| addText | Add a text into the label  |IText | <pre>**y:** A value for Y coordinate. The lower left corner is the origin point of the XY coordinate system. The Y value is the vertical offset from origin point. <br>**x:** A value for X coordinate. The lower left corner is the origin of the XY coordinate system. The X value is the horizontal offset from origin point. <br>**text:**  A string of printable data with maximum 255 characters in length. <br>**font:** Font type. (import { Font } ... and use Font[xxx].font) <br>**subFont:** subFont type. (import { Font } ... and use Font[xxx].subFont[zzz])<br>**hScale:** Horizontal scale. '0' through '9' and 'A' through 'O' represent the width of wide bar. ('A'=10,'B'=11, .. and 'O'=24)<br>**vScale:** Vertical scale. '0' through '9' and 'A' through 'O' represent the width of wide bar. ('A'=10,'B'=11, .. and 'O'=24)<br>**direction:** print direction (import { Direction } ...)</pre> |```.addText({ y: 10, x: 10, text: 'My first test!' })``` |
| clearMemory | Clear selected memory |string | <pre>**memory:** Memory to be cleared (use import { Memory } from ...)</pre>|```.clearMemory(Memory.RAM)``` |
| clearAllMemory | Clear both memories |-- | |```.clearAllMemory()``` |
| sendGraphic | Send the image to the printer (monochromatic .bmp) | IsendGraphic | <pre>**imageBuffer:** The Buffer of the image (8-bit BMP file format).<br>**name:** The name of the image (maximum 16 characters). The file name can be accessed with label formatting commands.<br>**flipped:** Boolean for whether the image will be flipped.<br>**memory:** Memory location to be saved</pre> |```.sendGraphic()``` *see details below |
| addGraphic | Add the image stored in memory | IGraphic | <pre>**y:** value for Y coordinate. The lower left corner is the origin point of the XY coordinate system. The Y value is the vertical offset from origin point. <br>**x:** A value for X coordinate. The lower left corner is the origin of the XY coordinate system. The X value is the horizontal offset from origin point. <br>**name:** The name of the image that was downloaded (maximum 16 characters).<br>**deleteAfter:** Delete this image after use?<br>**memory:** Memory location where it was saved.<br>**repeatColumns:** Repeat the same data for all columns (default false)</pre> |```.addGraphic()``` *see details below |
| deleteGraphic | Delete the image stored in memory | IDeleteGraphic | <pre>**name:** The name of the image that was downloaded (maximum 16 characters).<br>**memory:** Memory location where it was saved </pre> |```.deleteGraphic()``` *see details below |
| addPreCommand | Enter commands at the beginning, can be used to change printer settings (system command, interactions or others) | string | <pre>**command:** A raw command. </pre> |```.addPreCommand('<STX>M0550<CR>')``` |
| addCommand | Enter commands to edit the label | string | <pre>**command:** A raw command. </pre> |```.addCommand('A2')``` |
| addPostCommand | Enter commands after label editing commands | string | <pre>**command:** A raw command. </pre> | ```.addPostCommand('<STX>xAGmyimage<CR>')``` |
| build | Return the code in Buffer | | <pre>**copies:** number of copies</pre> |```.build()``` *see details below, [here](#functions-graphic) |
| send | Send to printer <sub>Note: The function to be used is configured at class initialization or in setConfig (param config.printFunction) </sub>| | | ```.send()``` *see details below, [here](#functions-graphic) |
| getCode | Return the code in text format | | <pre>**copies:** number of copies</pre> |```.getCode``` *see details below, [here](#functions-graphic) |

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