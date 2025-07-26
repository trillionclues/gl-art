# WebGL2 ASCII Art Converter

Sample implementation attempt at transforming images and videos into ASCII, ANSI, BBS, and Mosaic styles with real-time processing and beautiful retro aesthetics.

## ✨ Features

- **🚀 WebGL2 Acceleration**: GPU-powered rendering using the OGL library for smooth performance
- **🎨 Multiple Art Styles**: 
  - **ASCII**: Classic text art using standard ASCII characters
  - **ANSI**: Colorized terminal output with escape codes
  - **BBS**: Bulletin Board System style with extended characters
  - **Mosaic**: Block-based patterns using half-height characters
- **📁 Multi-Format Support**: Upload images (PNG, JPG, GIF) and videos (MP4, WebM)
- **🎛️ Real-Time Controls**: Adjust width, height, contrast, and brightness on the fly
- **💾 Export Functionality**: Download your creations as text files
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices
- **🌙 Dark Theme**: Retro computing aesthetics with neon accent colors

## 🎯 Demo

Try the live demo: [ASCII Art Converter](https://webgl-art.vercel.app/)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **WebGL**: OGL (WebGL abstraction library)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 🚀 Quick Start

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webgl2-ascii-art-converter.git
   cd webgl2-ascii-art-converter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

1. **Upload Media**: Drag and drop an image or video file, or click "Choose File"
2. **Select Style**: Choose from ASCII, ANSI, BBS, or Mosaic conversion styles
3. **Adjust Settings**: Fine-tune width, height, contrast, and brightness using the control panel
4. **View Results**: Watch your media transform in real-time with WebGL2 rendering
5. **Export**: Download your ASCII art as a text file

## 🎨 How the text Prop is Generated
When a file is uploaded and options are set, the following happens:

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

### ASCII
```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

### ANSI
```
████████████████████████████████████████████████████████████████████████████
████████████████████████████████████████████████████████████████████████████
```

### BBS
```
█▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬█
█▫▪•∙·∙•▪▫▫▪•∙·∙•▪▫▫▪•∙·∙•▪▫▫▪•∙·∙•▪▫▫▪•∙·∙•▪▫▫▪•∙·∙•▪▫▫▪•∙·∙•▪▫▫▪•∙·∙•▪▫█
█▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬█
```

### Mosaic
```
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█
```

## 🔧 Configuration

### Conversion Settings

- **Width**: 20-200 characters (default: 80)
- **Height**: 10-100 characters (default: 40)
- **Contrast**: 0.5-3.0 (default: 1.2)
- **Brightness**: 0.5-2.0 (default: 1.0)

### Supported Formats

- **Images**: PNG, JPG, JPEG, GIF, WebP
- **Videos**: MP4, WebM, OGV

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by retro computing and terminal art aesthetics
- Built with modern web technologies for optimal performance
- Special thanks to the [OGL](https://github.com/oframe/ogl) library for WebGL abstraction
- Reference implementation: [video-stream-ascii-player](https://github.com/Im-Rises/video-stream-ascii-player)

## 📊 Browser Support

- Chrome 56+
- Firefox 51+
- Safari 15+
- Edge 79+

*Requires WebGL2 support*

---

<div align="center">
  <strong>Built with ❤️ and WebGL2</strong>
</div>
