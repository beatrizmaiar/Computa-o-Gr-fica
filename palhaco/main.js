function main() {
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext('webgl');

    if (!gl) {
        throw new Error('WebGL not supported');
    }

    // Obtém o código fonte dos shaders a partir de elementos script no HTML
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

    // Cria os shaders utilizando as fontes obtidas
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Cria o programa de shader com os shaders criados
    var program = createProgram(gl, vertexShader, fragmentShader);

    // Utiliza o programa de shader
    gl.useProgram(program);

    // Cria buffers para armazenar dados de posição e cor
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    // Obtém a localização do atributo de posição no programa de shader
    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation); // Habilita o uso do atributo de posição
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // Vincula o buffer de posição
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0); // Define como os dados do buffer serão lidos

    // Obtém a localização do atributo de cor no programa de shader
    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0); 

    // Define a cor de limpeza do canvas (branco) e limpa a tela
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Cabelo
    n = 60; // Número de triângulos para formar o círculo
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setOvalVerticesAng(gl, n,  0.25, 0.15, -0.3, 0.1, -10); // Define as coordenadas do círculo
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [1.0, 0.0, 0.0]); 
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n); // Desenha o círculo

    n = 60; // Número de triângulos para formar o círculo
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setOvalVerticesAng(gl, n,  0.25, 0.15, 0.3, 0.1, 10); // Define as coordenadas do círculo
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [1.0, 0.0, 0.0]); 
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n); // Desenha o círculo

    
    //Cabeca do palhaço
    n = 90; // Número de triângulos para o círculo suave
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.3, 0.0, 0.0); 
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [1.0, 0.8, 0.7]); // Define a cor amarela para o círculo
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n); // Desenha o círculo

    //nariz
    n = 90; // Número de triângulos para o círculo suave
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.1, 0.0, 0.0); 
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [1.0, 0.0, 0.0]); // Define a cor amarela para o círculo
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n); // Desenha o círculo

    //olho
    n = 90; // Número de triângulos para o círculo suave
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.05, -0.15, 0.1); 
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0.0, 0.0, 0.0]); // Define a cor amarela para o círculo
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n); // Desenha o círculo

    n = 90; // Número de triângulos para o círculo suave
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.05, 0.15, 0.1); 
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0.0, 0.0, 0.0]); // Define a cor amarela para o círculo
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n); // Desenha o círculo

    //boca
    n = 60; // Número de triângulos para formar o círculo
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setOvalVerticesAng(gl, n,  0.10, 0.05, 0.05, -0.17, 82); // Define as coordenadas do círculo
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [1.0, 1.0, 1.0]); 
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n); // Desenha o círculo

    n = 60; // Número de triângulos para formar o círculo
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setOvalVerticesAng(gl, n,  0.10, 0.05, -0.05, -0.17, -82); // Define as coordenadas do círculo
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [1.0, 1.0, 1.0]); 
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n); // Desenha o círculo

}


// Função para criar e compilar um shader
function createShader(gl, type, source) {
    var shader = gl.createShader(type); // Cria o shader do tipo especificado
    gl.shaderSource(shader, source); // Define o código fonte do shader
    gl.compileShader(shader); // Compila o shader
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS); // Verifica se a compilação foi bem-sucedida
    if (success) {
        return shader; // Retorna o shader se a compilação foi bem-sucedida
    }

    console.log(gl.getShaderInfoLog(shader)); // Exibe erros de compilação
    gl.deleteShader(shader); // Deleta o shader em caso de erro
}

// Função para criar um programa de shader
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram(); // Cria o programa de shader
    gl.attachShader(program, vertexShader); // Anexa o shader de vértices
    gl.attachShader(program, fragmentShader); // Anexa o shader de fragmentos
    gl.linkProgram(program); // Linka os shaders no programa
    var success = gl.getProgramParameter(program, gl.LINK_STATUS); // Verifica se o link foi bem-sucedido
    if (success) {
        return program; // Retorna o programa se o link foi bem-sucedido
    }

    console.log(gl.getProgramInfoLog(program)); // Exibe erros de link
    gl.deleteProgram(program); // Deleta o programa em caso de erro
}

// Função para definir os vértices de um retângulo
function setRectangleVertices(gl, x, y, width, height) {
    var x1 = x; // Coordenada x esquerda
    var x2 = x + width; // Coordenada x direita
    var y1 = y; // Coordenada y inferior
    var y2 = y + height; // Coordenada y superior
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ // Define os dados de buffer com as coordenadas
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW); // Armazena os dados no buffer
}

// Função para definir a cor de um retângulo
function setRectangleColor(gl, color) {
    colorData = [];
    // Para cada triângulo, define a cor
    for (let triangle = 0; triangle < 2; triangle++) {
        for (let vertex = 0; vertex < 3; vertex++)
            colorData.push(...color); // Adiciona a cor aos dados
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW); // Armazena as cores no buffer
}

// Função para definir os vértices de um círculo
function setCircleVertices(gl, n, radius, centerX = 0.0, centerY = 0.0) {
    let vertexData = [];
    for (let i = 0; i < n; i++) {
        vertexData.push(centerX, centerY);
        vertexData.push(centerX + radius * Math.cos(i * (2 * Math.PI) / n), centerY + radius * Math.sin(i * (2 * Math.PI) / n));
        vertexData.push(centerX + radius * Math.cos((i + 1) * (2 * Math.PI) / n), centerY + radius * Math.sin((i + 1) * (2 * Math.PI) / n));
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function setOvalVertices(gl, n, radiusX, radiusY, centerX = 0.0, centerY = 0.0) {
    let vertexData = [];
    for (let i = 0; i < n; i++) {
        vertexData.push(centerX, centerY);
        vertexData.push(centerX + radiusX * Math.cos(i * (2 * Math.PI) / n), centerY + radiusY * Math.sin(i * (2 * Math.PI) / n));
        vertexData.push(centerX + radiusX * Math.cos((i + 1) * (2 * Math.PI) / n), centerY + radiusY * Math.sin((i + 1) * (2 * Math.PI) / n));
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}

function setOvalVerticesAng(gl, n, radiusX, radiusY, centerX = 0.0, centerY = 0.0, angle = 0) {
    let vertexData = [];
    for (let i = 0; i < n; i++) {
        // Calcula as coordenadas da oval
        let x1 = centerX + radiusX * Math.cos(i * (2 * Math.PI) / n);
        let y1 = centerY + radiusY * Math.sin(i * (2 * Math.PI) / n);

        let x2 = centerX + radiusX * Math.cos((i + 1) * (2 * Math.PI) / n);
        let y2 = centerY + radiusY * Math.sin((i + 1) * (2 * Math.PI) / n);

        // Aplica a rotação
        let rotatedX1 = centerX + (x1 - centerX) * Math.cos(angle) - (y1 - centerY) * Math.sin(angle);
        let rotatedY1 = centerY + (x1 - centerX) * Math.sin(angle) + (y1 - centerY) * Math.cos(angle);

        let rotatedX2 = centerX + (x2 - centerX) * Math.cos(angle) - (y2 - centerY) * Math.sin(angle);
        let rotatedY2 = centerY + (x2 - centerX) * Math.sin(angle) + (y2 - centerY) * Math.cos(angle);

        // Adiciona os vértices rotacionados ao buffer
        vertexData.push(centerX, centerY);
        vertexData.push(rotatedX1, rotatedY1);
        vertexData.push(rotatedX2, rotatedY2);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);
}


// Função para definir a cor de um círculo
function setCircleColor(gl, n, color) {
    colorData = [];
    // Para cada triângulo, define a cor
    for (let triangle = 0; triangle < n; triangle++) {
        for(let vertex=0; vertex<3; vertex++)
          colorData.push(...color);
      }
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
    }
  
    main();