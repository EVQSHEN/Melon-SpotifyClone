import { createCanvas, loadImage } from 'canvas';
import { colorType } from '@/types/interface';
export const pickColors = async (
  albumCover: string | undefined,
  setColors: React.Dispatch<React.SetStateAction<colorType | undefined>>,
) => {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');
  if (albumCover) {
    const image = await loadImage(albumCover, { crossOrigin: 'Anonymous' });
    ctx.drawImage(image, 0, 0, 200, 200);
    const imageData = ctx.getImageData(0, 0, 200, 200).data;
    const medianBrightness = getMedianBrightness(imageData);
    const midColors = getMidColors(imageData, 3, medianBrightness);
    if (midColors.length !== 3) {
      const colors = ['#202020', '#202020', '#404040'];
      setColors({ color: colors, transparency: transparencyFunc(colors) });
    } else {
      setColors({ color: midColors });
      setColors({ color: midColors, transparency: transparencyFunc(midColors) });
    }
  }
};

const transparencyFunc = (colors: string[]) => {
  const transparency = 0.2;
  const update = colors.map((color) => `rgba(${color.slice(4, -1)}, ${transparency})`);
  return update;
};
const getMedianBrightness = (imageData: Uint8ClampedArray) => {
  const brightnessArray = [];
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const brightness = r + g + b;
    brightnessArray.push(brightness);
  }
  brightnessArray.sort((a, b) => a - b);
  const middleIndex = Math.floor(brightnessArray.length / 2);
  return brightnessArray[middleIndex];
};
const getMidColors = (
  imageData: Uint8ClampedArray,
  count: number | undefined,
  medianBrightness: number,
) => {
  const colorCounts: { [key: string]: number } = {};
  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];
    const brightness = r + g + b;
    const isDarkEnough = brightness <= medianBrightness;
    if (isDarkEnough) {
      const colorKey = `rgb(${r},${g},${b})`;
      if (!isBlackOrWhiteColor(r, g, b)) {
        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
      }
    }
  }

  const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
  const distinctColors: string[] = [];
  if (count) {
    for (let i = 0; i < sortedColors.length && distinctColors.length < count; i++) {
      const color = sortedColors[i];
      const isDifferentEnough = distinctColors.every((existingColor) => {
        const colorDifference = getColorDifference(color, existingColor);
        return colorDifference > 50;
      });
      if (isDifferentEnough) {
        distinctColors.push(color);
      }
    }
  }
  return distinctColors.slice(0, count);
};

const isBlackOrWhiteColor = (r: number, g: number, b: number) => {
  const threshold = 40;
  return (
    (r < threshold && g < threshold && b < threshold) ||
    (r > 255 - threshold && g > 255 - threshold && b > 255 - threshold)
  );
};

const getColorDifference = (color1: string, color2: string) => {
  const [r1, g1, b1] = color1
    .substring(4, color1.length - 1)
    .split(',')
    .map((c) => parseInt(c));
  const [r2, g2, b2] = color2
    .substring(4, color2.length - 1)
    .split(',')
    .map((c) => parseInt(c));
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
};
