import React, { useEffect, useRef, useState } from "react";
import { WebGLRenderer } from "../utils/webglRenderer";
import { ConversionStyle } from "../types";

interface RenderCanvasProps {
  text: string;
  style: ConversionStyle;
  width: number;
  height: number;
}

export const RenderCanvas: React.FC<RenderCanvasProps> = ({
  text,
  style,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Wait for canvas to be properly initialized
    const checkCanvasReady = () => {
      if (
        canvasRef.current &&
        canvasRef.current.offsetWidth > 0 &&
        canvasRef.current.offsetHeight > 0
      ) {
        setIsReady(true);
      } else {
        // Retry after a short delay
        setTimeout(checkCanvasReady, 50);
      }
    };

    checkCanvasReady();
  }, []);

  useEffect(() => {
    if (!isReady || !canvasRef.current) return;

    // Clean up previous renderer
    if (rendererRef.current) {
      rendererRef.current.destroy();
      rendererRef.current = null;
    }

    // Create new renderer
    try {
      rendererRef.current = new WebGLRenderer(canvasRef.current);
      rendererRef.current.resize();
    } catch (error) {
      console.error("Failed to create WebGL renderer:", error);
      return;
    }

    // Choose appropriate font based on style
    const getFontFamily = (style: ConversionStyle) => {
      // Use the improved font stack with better Unicode support
      const unicodeFonts =
        '"JetBrains Mono", "Source Code Pro", "Courier New", "DejaVu Sans Mono", "Consolas", "Monaco", monospace';

      switch (style) {
        case "bbs":
        case "mosaic":
        case "ansi":
          return unicodeFonts;
        default:
          return unicodeFonts;
      }
    };

    const config = {
      canvas: canvasRef.current,
      width,
      height,
      fontSize: 12,
      fontFamily: getFontFamily(style),
    };

    try {
      rendererRef.current.renderText(text, config, style);
    } catch (error) {
      console.error("Failed to render text:", error);
    }

    return () => {
      if (rendererRef.current) {
        try {
          rendererRef.current.destroy();
        } catch (error) {
          console.error("Error destroying renderer:", error);
        }
        rendererRef.current = null;
      }
    };
  }, [text, style, width, height, isReady]);

  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current && isReady) {
        try {
          rendererRef.current.resize();
        } catch (error) {
          console.error("Error resizing renderer:", error);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isReady]);

  return (
    <div className="bg-black rounded-lg overflow-hidden border border-gray-700">
      <canvas
        ref={canvasRef}
        className="w-full h-full min-h-[400px]"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
};
