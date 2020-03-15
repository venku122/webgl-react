import React, { Component } from 'react';
import shader1 from './shaders/vertex/shader1';
import frag1 from './shaders/fragment/frag1';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentDidMount = () => {
    requestAnimationFrame(this.drawTriangle);
  }

  createVertexBuffer = (vertices: number[], gl: WebGLRenderingContext): WebGLBuffer => {
    // create new buffer object
    const vertex_buffer = gl.createBuffer()!;

    // bind an empty array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // pass the verticies data to the buffer;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // unbind buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vertex_buffer;
  }


  createShader = (shaderCode: string, shaderType: number, gl: WebGLRenderingContext): WebGLShader => {
    // create a shader object
    const shader = gl.createShader(shaderType)!;

    // attach shader source code
    gl.shaderSource(shader, shaderCode);

    // compile shader
    gl.compileShader(shader);

    return shader;
  }

  createVertexShader = (shaderCode: string, gl: WebGLRenderingContext) => {
    return this.createShader(shaderCode, gl.VERTEX_SHADER, gl);
  }

  createFragmentShader = (shaderCode: string, gl: WebGLRenderingContext) => {
    return this.createShader(shaderCode, gl.FRAGMENT_SHADER, gl);
  }

  drawTriangle = () => {
    const canvas: HTMLCanvasElement = document.getElementById('webgl-target')! as HTMLCanvasElement;
    // const gl: WebGL2RenderingContext = canvas.getContext('webgl') as WebGL2RenderingContext;
    const gl: WebGLRenderingContext = canvas.getContext('webgl') as WebGLRenderingContext;

    let vertices = [-0.9, 0.9, -0.1, -0.9, 0.8, 0.2,];

    // create new buffer object
    const vertex_buffer = this.createVertexBuffer(vertices, gl);

    /* Create and compile shader programs */
    // create a vertex shader object
    let vertShader = this.createVertexShader(shader1, gl);

    // fragment shader source

    // create fragment shader
    let fragShader = this.createFragmentShader(frag1, gl);


    // create shader program
    let shaderProgram = gl.createProgram()!;

    // attach vertex shader
    gl.attachShader(shaderProgram, vertShader);

    // attach frag shader
    gl.attachShader(shaderProgram, fragShader);

    // link both programs
    gl.linkProgram(shaderProgram);

    // use the combined program shader object
    gl.useProgram(shaderProgram);

    /* Associate the shader programs to buffer objects */

    // bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // get attribute location
    let coord = gl.getAttribLocation(shaderProgram, 'coordinates');

    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    // enable attribute
    gl.enableVertexAttribArray(coord);

    /* Drawing the required objects (triangle) */

    // clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // set the viewport
    gl.viewport(0,0,canvas.width, canvas.height);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(this.drawTriangle);
  }
  render() {

    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <canvas id="webgl-target" width={400} height={400} />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    );
  }
}

export default App;
