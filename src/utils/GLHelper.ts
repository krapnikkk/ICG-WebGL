import { vec2 } from 'gl-matrix';
const GET_A_WEBGL_BROWSER = `This page requires a browser that supports WebGL.<br/>
<a href="http://get.webgl.org">Click here to upgrade your browser.</a>`;

const OTHER_PROBLEM = `It doesn't appear your computer can support WebGL.<br/>
<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>`;
export default class GLHelper {
    public static create3DContext(canvas: HTMLCanvasElement, options?: any): WebGLRenderingContext | null {
        const names = ["webgl", "exprimental-webgl", "webkit-3d", "moz-webgl"];
        let context = null;
        for (let i = 0; i < names.length; i++) {
            try {
                context = canvas.getContext(names[i], options) as WebGLRenderingContext;
            } catch (e) {
                console.warn(e);
            }
            if (context) {
                break;
            }
        }
        return context;
    }

    public static createProgram(gl: WebGLRenderingContext, vertex: string, fragment: string): WebGLProgram | number {
        const vertexShader: WebGLShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vertexShader, vertex);
        gl.compileShader(vertexShader);

        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            const msg = `Vertex shader failed to compile.  The error log is:${gl.getShaderInfoLog(vertexShader)}`;
            console.error(msg);
            return -1;
        }

        const fragmentShader: WebGLShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fragmentShader, fragment);
        gl.compileShader(fragmentShader);

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            const msg = `Fragment shader failed to compile.  The error log is:${gl.getShaderInfoLog(fragmentShader)}`;
            console.error(msg);
            return -1;
        }

        const program = gl.createProgram()!;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const msg = `Shader program failed to link.  The error log is:${gl.getProgramInfoLog(program)}`;
            console.error(msg);
            return -1;
        }

        return program;
    }

    public static setupWebGL(canvas: HTMLCanvasElement, opt_attribs?: any): WebGLRenderingContext | null {
        function showLink(str: string) {
            const container = canvas.parentNode as HTMLElement;
            if (container) {
                container.innerHTML = makeFailHTML(str);
            }
        }

        function makeFailHTML(msg: string) {
            return `<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>
              <td align="center">
              <div style="display: table-cell; vertical-align: middle;">
              <div>${msg}</div>
              </div>
              </td></tr></table>`;
        }

        if (!window.WebGLRenderingContext) {
            showLink(GET_A_WEBGL_BROWSER);
            return null;
        }

        const context = this.create3DContext(canvas, opt_attribs);
        if (!context) {
            showLink(OTHER_PROBLEM);
        }
        return context;
    }

    public static pointsToBuffer(points: vec2[], Type = Float32Array): Float32Array {
        const deminsion = points[0].length;
        const len = points.length;
        const buffer = new Type(deminsion * len);
        let idx = 0;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < deminsion; j++) {
                buffer[idx++] = points[i][j];
            }
        }
        return buffer;
    }
}