// The canvas id
const canvasID = 'myFuckingCanvas'

/**
 * Vertex shader path
 * @type string
 */
const vsPath = ''

/**
 * Fragment shader path
 * @type string
 */
const fsPath = ''

async function OnDocumentReady() {
    /**
     * @type HTMLCanvasElement
     */
    const canvas = document.getElementById(canvasID)

    const gl = canvas.getContext('webgl')
    
    // Check if the current webGL rendering context is supported
    if(!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it. :\'(')
        return
    }

    const vsSrc = await fetch('test.frag')
    console.log(vsSrc)
}

document.addEventListener("DOMContentLoaded", OnDocumentReady)