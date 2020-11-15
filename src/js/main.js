/**
 * The canvas id
 * @type string
 */
const canvasID = 'myFuckingCanvas'

/**
 * Vertex shader path
 * @type string
 */
const vsPath = './../shaders/vertex.vert'

/**
 * Fragment shader path
 * @type string
 */
const fsPath = './../shaders/fragment.frag'


async function OnDocumentReady() {
    /**
     * @type HTMLCanvasElement
     */
    const canvas = document.getElementById(canvasID)
    canvas.height = document.body.clientHeight
    canvas.width = document.body.clientWidth

    // Get webgl context
    const gl = canvas.getContext('webgl')
    
    // Check if the current webGL rendering context is supported
    if(!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it. :\'(')
        return
    }

    // Load vertex shader source
    const vsSrc = await fetch(vsPath).then(res => res.text())

    // Load fragment shader source
    const fsSrc = await fetch(fsPath).then(res => res.text())

    // Load shader program
    const shaderProgram = InitShaderProgram(gl, vsSrc, fsSrc)

    const programInfos = {
        program: shaderProgram,

        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },

        uniformLocations: {
            iTime: gl.getUniformLocation(shaderProgram, 'iTime'),
            iResolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
        }
    }

    // Screen Quad vertices
    const vertices = [
        -1.0, -1.0,
        -1.0,  1.0,
         1.0,  1.0,
         1.0, -1.0
    ]

    // Screen Quad indices
    const indices = [
        0, 1, 2, 0, 2, 3
    ]

    // create buffer that store our vertices
    const vertexBuffer = gl.createBuffer()
    // bind our vertexBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // send data to our vertex buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    // create buffer that store our indices
    const indexBuffer = gl.createBuffer()
    // bind our indexBuffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    // send data to our indexBuffer
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

    const buffers = {
        vBuffer : vertexBuffer,
        iBuffer : indexBuffer,
    }

    requestAnimationFrame((time) => {
        DrawScene(canvas, gl, programInfos, buffers, time)
    })
}

/**
 * Resize canvas if it need to be resized.
 * @param {WebGLRenderingContext} gl WebGL context
 */
function Resize(gl) 
{
    const pixelRatio = window.devicePixelRatio;

    var screenWidth  = Math.floor(gl.canvas.clientWidth  * pixelRatio);
    var screenHeight = Math.floor(gl.canvas.clientHeight * pixelRatio);

    // Check if the canvas is not the same size.
    if (gl.canvas.width  !== screenWidth ||
        gl.canvas.height !== screenHeight) 
    {

        // Make the canvas the same size
        gl.canvas.width  = screenWidth;
        gl.canvas.height = screenHeight;
    }
}

/**
 * Draw scene!
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {WebGLRenderingContext} gl WebGL context
 * @param { number } programInfos.attribLocations.value - dwdwdw
 * @param {{vBuffer: WebGLBuffer, iBuffer: WebGLBuffer, cBuffer: WebGLBuffer}} buffers 
 * @param {number} time Time
 */
function DrawScene(canvas, gl, programInfos, buffers, time)
{
    Resize(gl)

    const iResolution = { x: gl.canvas.width, y: gl.canvas.height }
    
    gl.viewport(0, 0, iResolution.x, iResolution.y);

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vBuffer)
    gl.vertexAttribPointer(programInfos.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(programInfos.attribLocations.vertexPosition)

    gl.useProgram(programInfos.program)

    gl.uniform2f(programInfos.uniformLocations.iResolution, iResolution.x, iResolution.y)
    gl.uniform1f(programInfos.uniformLocations.iTime, time)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.iBuffer)
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)

    requestAnimationFrame((time) => {
        DrawScene(canvas, gl, programInfos, buffers, time / 1000)
    })
}

/**
 * Init a shader program.
 * @param {WebGLRenderingContext} gl WebGL rendering context
 * @param {string} vsSource vertex shader source
 * @param {string} fsSource fragment shader source
 * @returns {WebGLProgram} Shader program
 */
function InitShaderProgram(gl, vsSource, fsSource)
{
    const vShader = LoadShader(gl, gl.VERTEX_SHADER, vsSource)
    const fShader = LoadShader(gl, gl.FRAGMENT_SHADER, fsSource)

    const program = gl.createProgram()

    gl.attachShader(program, vShader)
    gl.attachShader(program, fShader)
    gl.linkProgram(program)

    if(!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
        return null;
    }

    return program
}

/**
 * Create shader, upload source and compile it.
 * @param {WebGLRenderingContext} gl WebGL rendering context.
 * @param {number} type Shader type.
 * @param {string} source Shader source.
 * @returns {WebGLShader} Shader compiled
 */
function LoadShader(gl, type, source)
{
    // Create shader
    const shader = gl.createShader(type)

    // Send source to the shader
    gl.shaderSource(shader, source)

    // Compile the shader
    gl.compileShader(shader)

    // Check if shader is not compiled successfully
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }

    return shader
}

document.addEventListener("DOMContentLoaded", OnDocumentReady)