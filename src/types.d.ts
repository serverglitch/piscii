export type Color = {
  r: number,
  g: number,
  b: number,
  a: number
}

export type ColorList = {
  [x: string]: string
}

export type ImageConversion = {
  lines: string[],
  line: string,
  lastColor: Color | string | null
}

