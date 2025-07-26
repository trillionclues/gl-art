export type ConversionStyle = 'ascii' | 'ansi' | 'bbs' | 'mosaic';

export interface ConversionOptions {
  style: ConversionStyle;
  width: number;
  height: number;
  contrast: number;
  brightness: number;
}

export interface FileUpload {
  file: File;
  type: 'image' | 'video';
  url: string;
}

export interface RenderConfig {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
}