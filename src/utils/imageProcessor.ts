import { ConversionStyle, ConversionOptions } from "../types";

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d")!;
  }

  async processImage(file: File, options: ConversionOptions): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.canvas.width = options.width;
        this.canvas.height = options.height;

        // Draw and process image
        this.ctx.drawImage(img, 0, 0, options.width, options.height);
        const imageData = this.ctx.getImageData(
          0,
          0,
          options.width,
          options.height
        );

        const convertedText = this.convertToStyle(imageData, options);
        resolve(convertedText);
      };
      img.src = URL.createObjectURL(file);
    });
  }

  private convertToStyle(
    imageData: ImageData,
    options: ConversionOptions
  ): string {
    const { data, width, height } = imageData;
    let result = "";

    switch (options.style) {
      case "ascii":
        result = this.convertToASCII(data, width, height, options);
        break;
      case "ansi":
        result = this.convertToANSI(data, width, height, options);
        break;
      case "bbs":
        result = this.convertToBBS(data, width, height, options);
        break;
      case "mosaic":
        result = this.convertToMosaic(data, width, height, options);
        break;
    }

    return result;
  }

  private convertToASCII(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options: ConversionOptions
  ): string {
    const chars = " .:-=+*#%@";
    let result = "";

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const adjustedLuminance =
          Math.pow(luminance, 1 / options.contrast) * options.brightness;
        const charIndex = Math.floor(adjustedLuminance * (chars.length - 1));

        result += chars[Math.max(0, Math.min(chars.length - 1, charIndex))];
      }
      result += "\n";
    }

    return result;
  }

  private convertToANSI(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options: ConversionOptions
  ): string {
    // Use block characters that work well in browsers
    const chars = " ░▒▓█";
    let result = "";

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const adjustedLuminance =
          Math.pow(luminance, 1 / options.contrast) * options.brightness;
        const charIndex = Math.floor(adjustedLuminance * (chars.length - 1));

        // Store color information in a special format that the renderer can parse
        const char = chars[Math.max(0, Math.min(chars.length - 1, charIndex))];
        const colorInfo = `${r},${g},${b}`;

        // Use a special delimiter that won't appear in normal text
        result += `[${colorInfo}]${char}`;
      }
      result += "\n";
    }

    return result;
  }

  private convertToBBS(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options: ConversionOptions
  ): string {
    // Use characters that are well-supported in most fonts
    const chars = " ·∙•▪▫▬█";
    let result = "";

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const adjustedLuminance =
          Math.pow(luminance, 1 / options.contrast) * options.brightness;
        const charIndex = Math.floor(adjustedLuminance * (chars.length - 1));

        result += chars[Math.max(0, Math.min(chars.length - 1, charIndex))];
      }
      result += "\n";
    }

    return result;
  }

  private convertToMosaic(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options: ConversionOptions
  ): string {
    // Use half-block characters that are well-supported
    const chars = " ▀▄█";
    let result = "";

    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x++) {
        const i1 = (y * width + x) * 4;
        const i2 = ((y + 1) * width + x) * 4;

        const lum1 =
          y < height
            ? (0.299 * data[i1] + 0.587 * data[i1 + 1] + 0.114 * data[i1 + 2]) /
              255
            : 0;
        const lum2 =
          y + 1 < height
            ? (0.299 * data[i2] + 0.587 * data[i2 + 1] + 0.114 * data[i2 + 2]) /
              255
            : 0;

        const adj1 = Math.pow(lum1, 1 / options.contrast) * options.brightness;
        const adj2 = Math.pow(lum2, 1 / options.contrast) * options.brightness;

        if (adj1 > 0.5 && adj2 > 0.5) result += "█";
        else if (adj1 > 0.5) result += "▀";
        else if (adj2 > 0.5) result += "▄";
        else result += " ";
      }
      result += "\n";
    }

    return result;
  }
}
