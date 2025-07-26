How the text Prop is Generated
In App.tsx, when a file is uploaded and options are set, the following happens:

1. An ImageProcessor instance is created.
2. The processImage method is called with the file and conversion options.
3. This method loads the image, draws it to a canvas, and gets the pixel data.
4. It then calls convertToStyle, which dispatches to one of:

- convertToASCII
- convertToANSI
- convertToBBS
- convertToMosaic

Each of these methods generates a string representation of the image in the selected style.
The resulting string is stored in convertedText.
The convertedText is then passed as the text prop to RenderCanvas

How the Conversion Works

1. ASCII: Uses a gradient of characters based on luminance.
2. ANSI: Similar, but tries to add ANSI color codes (which won't render in a browser/canvas).
3. BBS: Uses a different set of block/line characters.
4. Mosaic: Uses half-block and full-block characters for a mosaic effect.

Reference
- https://github.com/Im-Rises/video-stream-ascii-player
- https://www.npmjs.com/package/ogl
- https://tympanus.net/codrops/2024/11/13/creating-an-ascii-shader-using-ogl/
