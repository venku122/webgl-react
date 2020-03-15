import React, { Component } from 'react';
import shader1 from './shaders/vertex/shader1';
import vertex2 from './shaders/vertex/vertex2';
import frag1 from './shaders/fragment/frag1';
import frag2 from './shaders/fragment/frag2';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  private gl!: WebGLRenderingContext;
  private canvas!: HTMLCanvasElement;

  componentDidMount = () => {
    this.initializeCanvas();
    this.initializePoints();
  }

  createVertexBuffer = (vertices: number[]): WebGLBuffer => {
    const { gl } = this;
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


  createShader = (shaderCode: string, shaderType: number, ): WebGLShader => {
    const { gl } = this;
    // create a shader object
    const shader = gl.createShader(shaderType)!;

    // attach shader source code
    gl.shaderSource(shader, shaderCode);

    // compile shader
    gl.compileShader(shader);

    return shader;
  }

  createVertexShader = (shaderCode: string) => {
    const { gl } = this;
    return this.createShader(shaderCode, gl.VERTEX_SHADER);
  }

  createFragmentShader = (shaderCode: string) => {
    const { gl } = this;
    return this.createShader(shaderCode, gl.FRAGMENT_SHADER);
  }

  createShaderProgram = (shaders: WebGLShader[]) => {
    const { gl } = this;
    // create shader program
    const shaderProgram = gl.createProgram()!;

    shaders.forEach((shader) => {
      gl.attachShader(shaderProgram, shader);
    });

    // link both programs
    gl.linkProgram(shaderProgram);

    // use the combined program shader object
    gl.useProgram(shaderProgram);
    return shaderProgram;
  }

  initializeCanvas = () => {
    const canvas: HTMLCanvasElement = document.getElementById('webgl-target')! as HTMLCanvasElement;
    // const gl: WebGL2RenderingContext = canvas.getContext('webgl') as WebGL2RenderingContext;
    const gl: WebGLRenderingContext = canvas.getContext('webgl') as WebGLRenderingContext;

    this.gl = gl;
    this.canvas = canvas;
  }

  initializePoints = () => {
    const { gl, canvas } = this;
    const verticies = [
      -0.5,0.5,0.0,
      0.0,0.5,0.0,
      -0.25,0.25,0.0, 
   ];

   const vertex_buffer = this.createVertexBuffer(verticies);

   const vertexShader = this.createVertexShader(vertex2);

   const fragShader = this.createFragmentShader(frag2);

   const shaderProgram = this.createShaderProgram([vertexShader, fragShader]);

    // bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // get attribute location
    let coord = gl.getAttribLocation(shaderProgram, 'coordinates');

    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

    // enable attribute
    gl.enableVertexAttribArray(coord);

    // enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // set the viewport
    gl.viewport(0,0,canvas.width, canvas.height);

    this.drawPoints();
  }

  initializeTriangle = () => {
    const { gl, canvas } = this;
    let vertices = [-0.9, 0.9, -0.1, -0.9, 0.8, 0.2,];

    // create new buffer object
    const vertex_buffer = this.createVertexBuffer(vertices);

    /* Create and compile shader programs */
    // create a vertex shader object
    let vertShader = this.createVertexShader(shader1);

    // fragment shader source

    // create fragment shader
    let fragShader = this.createFragmentShader(frag1);

    // create shader program
    const shaderProgram = this.createShaderProgram([vertShader, fragShader]);

    /* Associate the shader programs to buffer objects */

    // bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // get attribute location
    let coord = gl.getAttribLocation(shaderProgram, 'coordinates');

    // point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    // enable attribute
    gl.enableVertexAttribArray(coord);

    // enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // set the viewport
    gl.viewport(0,0,canvas.width, canvas.height);

    this.drawTriangles();
  }

  drawTriangles = () =>{
    /* Drawing the required objects (triangle) */
    const { gl } = this;
    // clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(this.drawTriangles);
  }

  
  drawPoints = () =>{
    /* Drawing the required objects (point) */
    const { gl } = this;
    // clear the canvas
    gl.clearColor(0.5, 0.5, 0.5, 0.9);

    // clear the color buffer bit
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the triangle
    gl.drawArrays(gl.POINTS, 0, 3);

    requestAnimationFrame(this.drawPoints);
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
