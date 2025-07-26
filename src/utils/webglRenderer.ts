import {
  Renderer,
  Camera,
  Transform,
  Mesh,
  Program,
  Geometry,
  Texture,
  Vec3,
} from "ogl";
import { RenderConfig } from "../types";

export class WebGLRenderer {
  private renderer: Renderer;
  private camera: Camera;
  private scene: Transform;
  private textMesh: Mesh | null = null;
  private program: Program | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    this.camera = new Camera(this.renderer.gl);
    this.camera.position.set(0, 0, 1);

    this.scene = new Transform();

    this.setupShaders();
  }

  private setupShaders() {
    const gl = this.renderer.gl;

    const vertex = `
      attribute vec2 position;
      attribute vec2 uv;
      
      uniform mat4 modelViewMatrix;
      uniform mat4 projectionMatrix;
      
      varying vec2 vUv;
      
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.0, 1.0);
      }
    `;

    const fragment = `
      precision highp float;
      
      uniform sampler2D tMap;
      uniform vec3 uColor;
      uniform float uTime;
      uniform bool uUseCustomColors;
      uniform sampler2D tColorMap;
      
      varying vec2 vUv;
      
      void main() {
        vec4 tex = texture2D(tMap, vUv);
        
        vec3 color = uColor;
        if (uUseCustomColors) {
          vec4 colorData = texture2D(tColorMap, vUv);
          color = colorData.rgb;
        }
        
        // Add subtle glow effect
        float glow = sin(uTime * 2.0) * 0.1 + 0.9;
        color = color * tex.rgb * glow;
        
        gl_FragColor = vec4(color, tex.a);
      }
    `;

    this.program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: null },
        tColorMap: { value: null },
        uColor: { value: new Vec3(0, 1, 0.5) },
        uTime: { value: 0 },
        uUseCustomColors: { value: false },
      },
    });
  }

  createTextTexture(
    text: string,
    config: RenderConfig,
    style: string
  ): { texture: Texture; colorTexture?: Texture } {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Calculate canvas size based on text
    const lines = text.split("\n");
    const maxLineLength = Math.max(...lines.map((line) => line.length));

    canvas.width = maxLineLength * config.fontSize * 0.6;
    canvas.height = lines.length * config.fontSize * 1.2;

    // Setup text rendering
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff88";
    ctx.font = `${config.fontSize}px ${config.fontFamily}`;
    ctx.textBaseline = "top";

    let colorTexture: Texture | undefined;

    if (style === "ansi") {
      // Create color texture for ANSI
      const colorCanvas = document.createElement("canvas");
      const colorCtx = colorCanvas.getContext("2d")!;
      colorCanvas.width = canvas.width;
      colorCanvas.height = canvas.height;

      // Parse ANSI text with color information
      let x = 0;
      let y = 0;

      for (const line of lines) {
        let currentX = 0;
        const chars = line.split("");
        let i = 0;

        while (i < chars.length) {
          if (chars[i] === "[" && i + 1 < chars.length) {
            // Parse color information
            const colorEnd = line.indexOf("]", i);
            if (colorEnd !== -1) {
              const colorStr = line.substring(i + 1, colorEnd);
              const [r, g, b] = colorStr.split(",").map(Number);

              // Draw character with custom color
              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              const char = chars[colorEnd + 1];
              if (char) {
                ctx.fillText(char, currentX, y * config.fontSize * 1.2);

                // Set color in color texture
                colorCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                colorCtx.fillRect(
                  currentX,
                  y * config.fontSize * 1.2,
                  config.fontSize * 0.6,
                  config.fontSize * 1.2
                );

                currentX += config.fontSize * 0.6;
                i = colorEnd + 2;
              } else {
                i++;
              }
            } else {
              i++;
            }
          } else {
            // Regular character
            ctx.fillText(chars[i], currentX, y * config.fontSize * 1.2);
            currentX += config.fontSize * 0.6;
            i++;
          }
        }
        y++;
      }

      const gl = this.renderer.gl;
      colorTexture = new Texture(gl, {
        image: colorCanvas,
        generateMipmaps: false,
      });
    } else {
      // Regular text rendering for other styles
      lines.forEach((line, index) => {
        ctx.fillText(line, 0, index * config.fontSize * 1.2);
      });
    }

    const gl = this.renderer.gl;
    const texture = new Texture(gl, {
      image: canvas,
      generateMipmaps: false,
    });

    return { texture, colorTexture };
  }

  renderText(text: string, config: RenderConfig, style: string) {
    if (!this.program) return;

    const { texture, colorTexture } = this.createTextTexture(
      text,
      config,
      style
    );

    // Update color based on style
    const colors = {
      ascii: new Vec3(0, 1, 0.5),
      ansi: new Vec3(1, 0.5, 0),
      bbs: new Vec3(0.5, 0, 1),
      mosaic: new Vec3(1, 0, 0.5),
    };

    this.program.uniforms.uColor.value =
      colors[style as keyof typeof colors] || colors.ascii;
    this.program.uniforms.tMap.value = texture;
    this.program.uniforms.tColorMap.value = colorTexture || texture;
    this.program.uniforms.uUseCustomColors.value =
      style === "ansi" && !!colorTexture;
    this.program.uniforms.uTime.value = Date.now() * 0.001;

    // Create new geometry
    const geometry = new Geometry(this.renderer.gl, {
      position: {
        size: 2,
        data: new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      },
      uv: { size: 2, data: new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]) },
      index: { data: new Uint16Array([0, 1, 2, 1, 3, 2]) },
    });

    if (this.textMesh) {
      this.textMesh.geometry = geometry;
      this.textMesh.program = this.program;
    } else {
      this.textMesh = new Mesh(this.renderer.gl, {
        geometry,
        program: this.program,
      });
      this.textMesh.setParent(this.scene);
    }

    this.render();
  }

  private render() {
    this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  resize() {
    const { canvas } = this.renderer;

    // Check if canvas is properly initialized
    if (!canvas || !canvas.offsetWidth || !canvas.offsetHeight) {
      return;
    }

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    this.renderer.setSize(width, height);
    this.camera.perspective({ aspect: width / height });
  }

  destroy() {
    if (this.textMesh) {
      this.textMesh.setParent(null);
      this.textMesh = null;
    }

    if (this.program) {
      this.program.remove();
      this.program = null;
    }

    if (this.renderer) {
      this.renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  }
}
