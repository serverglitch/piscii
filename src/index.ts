import { colorList, xList } from "./colors";
import nearestColor from "nearest-color";
import { Color, ColorList, ImageConversion } from "./types";

/**
 * Many elements of the ascii portion of this are from the following ascii converter:
 * https://github.com/jpetitcolas/ascii-art-converter/blob/master/src/index.js
 */
const canvas = document.getElementById('preview') as HTMLCanvasElement;
const asciiImage = document.getElementById('ascii');
const xTermData = document.getElementById('xterm');
const context = canvas!.getContext('2d');

const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
const scaleInput = document.getElementById('scale');
const size = {
  width: 100,
  height: 100
};

nearestColor

// https://www.kdnuggets.com/2019/12/convert-rgb-image-grayscale.html
// gamma correction with a linear approximation is too strongly separated in xterm colors
// const toGrayScale = (r, g, b, a) => (0.299 * r + 0.587 * g + 0.114 * b) * (a / 255);
const toGrayScale = (r: number, g: number, b: number): number => 0.2126 * r + 0.7152 * g + 0.0722 * b;

// get monospaced font ratio for better sampling
const getFontRatio = (): number => {
  const pre = document.createElement('pre');
  pre.style.display = 'inline';
  pre.textContent = ' ';

  document.body.appendChild(pre);
  const { width, height } = pre.getBoundingClientRect();
  document.body.removeChild(pre);

  return height / width;
};

// clamp ratio for sampling
const clampSize = (width: number, height: number): [width: number, height: number] => {
  const adjustedWidth = Math.floor(getFontRatio() * width);

  if (height > size.height) {
    return [Math.floor(adjustedWidth * size.height / height), size.height];
  }

  if (width > size.width) {
    return [size.width, Math.floor(height * size.width / adjustedWidth)];
  }

  return [adjustedWidth, height];
};

const convertImage = (context: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = context.getImageData(0, 0, width, height);
  const grayScales: number[] = [];
  const xTermColors: string[] = [];
  const pixelColors: Color[] = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    const a = imageData.data[i + 3];

    const grayScale = toGrayScale(r, g, b);
    imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = imageData.data[i+3] = grayScale;

    grayScales.push(grayScale);
    const nearest = nearestColor.from(colorList)({ r, g, b });
    pixelColors.push({...nearest.rgb, a} as Color);

    xTermColors.push(xList[nearest.name as keyof ColorList]);
  }

  context.putImageData(imageData, 0, 0);
  return { grayScales, pixelColors, xTermColors };
};

const reader = new FileReader();

const renderImage = () => {
  {
    const image = new Image();
    image.onload = () => {
      const [width, height] = clampSize(image.width, image.height);
      canvas.width = width;
      canvas.height = height;

      context!.drawImage(image, 0, 0, width, height);
      const { grayScales, pixelColors, xTermColors } = convertImage(context!, width, height);

      drawAscii(grayScales, pixelColors, xTermColors, width);
      fileInput!.value = '';
    }

    image.src = reader.result as string;
  };
};

fileInput.onchange = (e) => {
  // @ts-ignore
  const file = e!.target.files[0];
  reader.onload = renderImage;
  reader.readAsDataURL(file);
};

// the image is displayed on a dark background, so the ramp is reversed, allowing
// more of the dark to show through on darker gray values
const grayRamp = ' ****########%%%%%%%%%%%@@@@@@@@@@@@@@@@';
const rampLength = grayRamp.length;

const convertToChar = (grayScale: number): string => grayRamp[Math.ceil((rampLength - 1) * grayScale / 255)];

const drawAscii = (grayScales: number[], pixelColors: Color[], xTermColors: string[], width:number): void => {
  const html: ImageConversion = { lines: [], line: '', lastColor: null };
  const xterm: ImageConversion = { lines: [], line: '', lastColor: null };
  let leastSpaces = 10000;

  grayScales.forEach((scale, index) => {
    const rampChar = convertToChar(scale);
    let color = pixelColors[index];
    let xcolor = xTermColors[index];
    if (color.a !== 0) {
      xterm.line += (xterm.lastColor === xcolor) ? rampChar : `|${xcolor}${rampChar}`;
      html.line += (html.lastColor === color) ?
        rampChar :
        `${html.line !== '' ? '</span>' : ''}<span style="background-color:none;color:rgb(${color.r},${color.g},${color.b})">${rampChar}`;
    } else {
      xterm.line += ' ';
      html.line += ' ';
    }

    // complete a single row and calculate left-side distance to edge of
    // art, used to trim excess space
    if ((index + 1) % width === 0) {
      const i = html.line.search(/\S/);
      if (i < leastSpaces && i > -1) { leastSpaces = i };
      if (/^\s+$/.exec(html.line) === null) {
        html.lines.push(html.line);
        xterm.lines.push(xterm.line);
      }
      xterm.line = '';
      html.line = '';
    }

    xterm.lastColor = color;
    html.lastColor = color;
  });

  // trim as much from lines as possible before converting to lower char length
  xTermData!.innerText = xterm.lines.map((l, i) => {
    const prefix = i === 0 ? '|000' : '';
    return prefix + l.slice(leastSpaces).trimEnd().replace(/[ ]/gm, '|_');
  }).join('|/');
  asciiImage!.innerHTML = html.lines.map(l => l.slice(leastSpaces).trimEnd()).join('<br>');
};

const updateValue = (e: any) => {
  size.height = size.width = parseInt(e.target.value);
  renderImage();
};

scaleInput!.addEventListener('change', updateValue);