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

    //Desenho da Carroça do Carro
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, -0.5, -0.5, 1.5, 1.0); //Carroça do carro
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, [1.0, 0.0, 0.0]); // Define uma cor aleatória para o retângulo
    gl.drawArrays(gl.TRIANGLES, 0, 6); // Desenha o retângulo

    //Desenho do Capô do Carro
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, -0.4, 0.5, 1.0, 1.1); //Carroça do carro
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, [0.0, 0.0, 1.0]); 
    gl.drawArrays(gl.TRIANGLES, 0, 6); // Desenha o retângulo

    // Desenho da roda 1
    n = 60; // Número de triângulos para o círculo suave
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n, 0.25, -0.1, -0.5); // Ajuste o centro do círculo para (0.0, -0.5)
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0.0, 0.0, 0.0]); // Define a cor preta para o círculo
    gl.drawArrays(gl.TRIANGLES, 0, 3 * n); // Desenha o círculo


    //Dsenho da roda 2
    n = 60; // Número de triângulos para formar o círculo
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setCircleVertices(gl, n,  0.25, 0.6, -0.5); // Define as coordenadas do círculo
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setCircleColor(gl, n, [0.0, 0.0, 0.0]); // Define uma cor aleatória para o círculo
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