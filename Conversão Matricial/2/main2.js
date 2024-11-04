const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");


const vertexShaderSource = `
    attribute vec2 a_position;
    void main() {
    gl_Position = vec4(a_position, 0, 1);
    }
`;
const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
    gl_FragColor = u_color;
    }
`;

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const positionLocation = gl.getAttribLocation(program, "a_position");
const colorLocation = gl.getUniformLocation(program, "u_color");
gl.uniform4f(colorLocation, 0, 0, 1, 1); 

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

let mode = "line"; 
let points = []; 
let clickCount = 0; 

function drawLine(x0, y0, x1, y1) {
    let linePoints = [];
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
    linePoints.push(x0, y0);
    if (x0 === x1 && y0 === y1) break;
    let e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx) { err += dx; y0 += sy; }
    }

    return linePoints;
}

function drawTriangleVertices(x0, y0, x1, y1, x2, y2) {
    return [x0, y0, x1, y1, x2, y2]; 
}

function normalizePoints(points) {
    return points.map((value, index) => 
    index % 2 === 0 
        ? (value / canvas.width) * 2 - 1 
        : 1 - (value / canvas.height) * 2
    );
}

function render() {
gl.clear(gl.COLOR_BUFFER_BIT);
const normalizedPoints = normalizePoints(points);

if (mode === "line" && points.length > 1) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalizedPoints), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINE_STRIP, 0, normalizedPoints.length / 2);
} else if (mode === "triangle" && points.length === 6) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalizedPoints), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINE_LOOP, 0, 3); 
}
points = []; 
}


canvas.addEventListener("click", (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    points.push(x, y);
    clickCount++;

    if (mode === "line" && clickCount === 2) {
    const [x0, y0, x1, y1] = points;
    points = drawLine(x0, y0, x1, y1);
    render();
    clickCount = 0;
    } else if (mode === "triangle" && clickCount === 3) {
    const [x0, y0, x1, y1, x2, y2] = points;
    points = drawTriangleVertices(x0, y0, x1, y1, x2, y2);
    render();
    clickCount = 0;
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "r" || event.key === "R") {
    mode = "line";
    points = [];
    clickCount = 0;
    gl.clear(gl.COLOR_BUFFER_BIT); 
    } else if (event.key === "t" || event.key === "T") {
    mode = "triangle";
    points = [];
    clickCount = 0;
    gl.clear(gl.COLOR_BUFFER_BIT); 
    } else if (!isNaN(event.key)) {
    const colors = [
        [1, 0, 0, 1], // vermelho
        [0, 1, 0, 1], // verde
        [0, 0, 1, 1], // azul
        [1, 1, 0, 1], // amarelo
        [1, 0, 1, 1], // magenta
        [0, 1, 1, 1], // ciano
        [0.5, 0.5, 0.5, 1], // cinza
        [1, 0.5, 0, 1], // laranja
        [0.5, 0, 0.5, 1], // roxo
        [0.25, 0.75, 0.25, 1] // verde claro
    ];
    const colorIndex = parseInt(event.key);
    gl.uniform4fv(colorLocation, colors[colorIndex]);
    render();
    }
});
