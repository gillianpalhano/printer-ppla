import { TMemories, TMemoriesName } from '../index.type'

export const Memory: { [key in TMemoriesName]: TMemories } = {
  RAM: 'A',
  FLASH: 'B',
  DEFAULT: 'C',
}
