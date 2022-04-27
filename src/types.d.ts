export type Color = {
  r: number,
  g: number,
  b: number,
  a: number
}

export type NearestColor = {
  distance: number,
  name: string,
  rgb: Color,
  value: string
}

export type ColorList = {
  [x: string]: string
}

export type ImageConversion = {
  lines: string[],
  line: string,
  lastColor: NearestColor | Color | string | null
}

