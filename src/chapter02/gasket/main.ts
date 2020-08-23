import GLHelper from 'utils/GLHelper';
import { vec2 } from 'gl-matrix';
import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';
let gl: WebGLRenderingContext, points: vec2[], NumPoints: number = 5000;

window.onload = () => {
    var canvas = document.querySelector('#gl') as HTMLCanvasElement;
    gl = GLHelper.setupWebGL(canvas)!;
    if (!gl) { alert("WebGL isn't available"); }

    var vertices: vec2[] = [
        vec2.fromValues(-1, -1),
        vec2.fromValues(0, 1),
        vec2.fromValues(1, -1)
    ];
    let u = vec2.add(vec2.create(), vertices[0], vertices[1]),
        v = vec2.add(vec2.create(), vertices[0], vertices[2]),
        p = vec2.scale(vec2.create(), vec2.add(vec2.create(), u, v), 0.25);

    points = [p];

    for (var i = 0; points.length < NumPoints; i++) {
        var j = Math.floor(Math.random() * 3);//随机0~2
        p = vec2.add(vec2.create(), points[i], vertices[j]);
        p = vec2.scale(vec2.create(), p, 0.5);//找到该点的二等分点
        points.push(p);
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    const program = GLHelper.createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    const bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, GLHelper.pointsToBuffer(points), gl.STATIC_DRAW);

    const vPosition = gl.getAttribLocation(program, 'vPosition');
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}