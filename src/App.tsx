import React, { useState, useCallback, useEffect } from "react";
import { Monitor, Zap } from "lucide-react";
import { FileUpload } from "./components/FileUpload";
import { StyleSelector } from "./components/StyleSelector";
import { ControlPanel } from "./components/ControlPanel";
import { RenderCanvas } from "./components/RenderCanvas";
import { ImageProcessor } from "./utils/imageProcessor";
import {
  FileUpload as FileUploadType,
  ConversionOptions,
  ConversionStyle,
} from "./types";

function App() {
  const [selectedFile, setSelectedFile] = useState<
    FileUploadType | undefined
  >();
  const [convertedText, setConvertedText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState<ConversionOptions>({
    style: "ascii",
    width: 80,
    height: 40,
    contrast: 1.2,
    brightness: 1.0,
  });

  const imageProcessor = new ImageProcessor();

  const processFile = useCallback(
    async (file: FileUploadType, conversionOptions: ConversionOptions) => {
      if (!file) return;

      setIsProcessing(true);
      try {
        console.log("Processing file with options:", conversionOptions);
        const text = await imageProcessor.processImage(
          file.file,
          conversionOptions
        );
        console.log(
          "Generated text (first 200 chars):",
          text.substring(0, 200)
        );
        console.log("Text length:", text.length);
        setConvertedText(text);
      } catch (error) {
        console.error("Processing failed:", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [imageProcessor]
  );

  useEffect(() => {
    if (selectedFile) {
      processFile(selectedFile, options);
    }
  }, [selectedFile, options, processFile]);

  const handleStyleChange = useCallback((style: ConversionStyle) => {
    console.log("Style changed to:", style);
    setOptions((prev) => ({ ...prev, style }));
  }, []);

  const handleExport = useCallback(() => {
    if (!convertedText) return;

    const blob = new Blob([convertedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ascii-art-${options.style}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [convertedText, options.style]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                ASCII Art Converter
              </h1>
              <p className="text-gray-400">
                Convert images and videos to text art with WebGL2
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* File Upload Section */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Upload Media
            </h2>
            <FileUpload
              onFileSelect={setSelectedFile}
              currentFile={selectedFile}
            />
          </section>

          {/* Style Selection */}
          {selectedFile && (
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">
                Choose Style
              </h2>
              <StyleSelector
                selectedStyle={options.style}
                onStyleChange={handleStyleChange}
              />
            </section>
          )}

          {/* Main Content Grid */}
          {selectedFile && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Controls */}
              <div className="lg:col-span-1">
                <ControlPanel
                  options={options}
                  onOptionsChange={setOptions}
                  onExport={handleExport}
                  isProcessing={isProcessing}
                />
              </div>

              {/* Render Output */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      WebGL2 Render Output
                    </h3>
                    {isProcessing && (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    )}
                  </div>

                  {convertedText ? (
                    <RenderCanvas
                      text={convertedText}
                      style={options.style}
                      width={options.width}
                      height={options.height}
                    />
                  ) : (
                    <div className="bg-gray-900 rounded-lg p-8 text-center border-2 border-dashed border-gray-700">
                      <p className="text-gray-400">
                        Upload an image or video to see the conversion
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-400">
            Built with WebGL2, OGL, and TypeScript • Inspired by retro computing
            aesthetics
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
