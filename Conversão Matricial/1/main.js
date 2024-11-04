// Configuração inicial
const canvas = document.querySelector("#canvas");
const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

// Verifica se o contexto WebGL foi carregado
if (!gl) {
    throw new Error("WebGL não é suportado");
}

// Shaders e programa WebGL
const vertexShaderSource = `
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        gl_PointSize = 2.0;
    }
`;
const fragmentShaderSource = `
    precision mediump float;
    uniform vec3 color;
    void main() {
        gl_FragColor = vec4(color, 1.0);
    }
`;

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

gl.useProgram(program);

// Localizações dos atributos e uniformes
const positionLocation = gl.getAttribLocation(program, "position");
const colorLocation = gl.getUniformLocation(program, "color");

// Buffers para posição
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Configuração de cor e fundo
let currentColor = [0.0, 0.0, 1.0]; // Azul inicial
gl.uniform3fv(colorLocation, currentColor);
gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Variáveis de controle de clique
let isFirstClick = true;
let x0, y0, x1, y1;

// Event listener para capturar os cliques
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const webglX = (x / canvas.width) * 2 - 1;
    const webglY = (y / canvas.height) * -2 + 1;

    if (isFirstClick) {
        // Armazena o primeiro clique
        x0 = x;
        y0 = y;
        isFirstClick = false;
    } else {
        // Armazena o segundo clique e desenha a linha
        x1 = x;
        y1 = y;
        gl.clear(gl.COLOR_BUFFER_BIT); // Limpa o canvas para redesenhar
        bresenhamLine(x0, y0, x1, y1, drawPixel);
        isFirstClick = true;
    }
});

// Mapeamento de cores para as teclas de 0 a 9
const colors = {
    "0": [0.0, 0.0, 0.0],  // Preto
    "1": [1.0, 0.0, 0.0],  // Vermelho
    "2": [0.0, 1.0, 0.0],  // Verde
    "3": [0.0, 0.0, 1.0],  // Azul
    "4": [1.0, 1.0, 0.0],  // Amarelo
    "5": [0.0, 1.0, 1.0],  // Ciano
    "6": [1.0, 0.0, 1.0],  // Magenta
    "7": [0.5, 0.5, 0.5],  // Cinza
    "8": [1.0, 0.5, 0.0],  // Laranja
    "9": [0.5, 0.0, 0.5]   // Roxo
};

// Event listener para mudar a cor com base na tecla pressionada
document.addEventListener("keydown", (event) => {
    if (colors.hasOwnProperty(event.key)) {
        currentColor = colors[event.key];
        gl.uniform3fv(colorLocation, currentColor);
    }
});

// Função para desenhar pixel
function drawPixel(x, y) {
    const webglX = (x / canvas.width) * 2 - 1;
    const webglY = (y / canvas.height) * -2 + 1;
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([webglX, webglY]), gl.STATIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, 1);
}

// Algoritmo de Bresenham
function bresenhamLine(x0, y0, x1, y1, drawPixel) {
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        drawPixel(x0, y0);
        if (x0 === x1 && y0 === y1) break;
        let e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

// Funções utilitárias para criação de shaders e programa
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}
